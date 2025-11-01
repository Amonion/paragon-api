import { Request, Response } from 'express'
import { queryData } from '../utils/query'
import { handleError } from '../utils/errorHandler'
import { ITransaction, Transaction } from '../models/transactionModel'
import { IProduct, Product } from '../models/productModel'

export const purchaseProducts = async (req: Request, res: Response) => {
  try {
    const cartProducts = req.body.cartProducts

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const productIds = cartProducts.map((p) => p._id)
    const dbProducts = await Product.find({ _id: { $in: productIds } })

    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (id) => !dbProducts.find((p) => p._id.toString() === id.toString())
      )
      return res.status(404).json({
        message: `Some products were not found: ${missingIds.join(', ')}`,
      })
    }

    const bulkOps = cartProducts.map((cartItem) => ({
      updateOne: {
        filter: { _id: cartItem._id },
        update: {
          $inc: { units: cartItem.cartUnits * (cartItem.unitPerPurchase || 1) },
        },
      },
    }))

    await Product.bulkWrite(bulkOps)

    await Transaction.create(req.body)

    const result = await queryData<IProduct>(Product, req)

    res.status(200).json({
      message: 'Product purchase has been successfully recorded.',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const CreateTrasanction = async (req: Request, res: Response) => {
  try {
    const cartProducts = req.body.cartProducts

    if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const productIds = cartProducts.map((p) => p._id)
    const dbProducts = await Product.find({ _id: { $in: productIds } })

    if (dbProducts.length !== productIds.length) {
      const missingIds = productIds.filter(
        (id) => !dbProducts.find((p) => p._id.toString() === id.toString())
      )
      return res.status(404).json({
        message: `Some products were not found: ${missingIds.join(', ')}`,
      })
    }

    const outOfStock: { name: string; available: number; requested: number }[] =
      []

    for (const cartItem of cartProducts) {
      const product = dbProducts.find(
        (p) => p._id.toString() === cartItem._id.toString()
      )
      if (!product) continue
      if (product.units < cartItem.cartUnits * cartItem.unitPerPurchase) {
        outOfStock.push({
          name: product.name,
          available: product.units,
          requested: cartItem.cartUnits,
        })
      }
    }

    if (outOfStock.length > 0) {
      return res.status(400).json({
        message:
          'Some items are out of stock. Please adjust your order and try again.',
        outOfStock,
      })
    }

    const bulkOps = cartProducts.map((cartItem) => ({
      updateOne: {
        filter: { _id: cartItem._id },
        update: {
          $inc: { units: -cartItem.cartUnits * cartItem.unitPerPurchase },
        },
      },
    }))

    await Product.bulkWrite(bulkOps)
    await Transaction.create(req.body)

    const result = await queryData<IProduct>(Product, req)
    res.status(200).json({
      message: 'The transaction has been created successfully.',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await queryData<ITransaction>(Transaction, req)
    res.status(200).json(result)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    await Transaction.findByIdAndUpdate(req.params.id, req.body)

    const result = await queryData<ITransaction>(Transaction, req)

    res.status(200).json({
      message: 'The transaction has been updated successfully.',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const GetTransactionSummary = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query

    if (!dateFrom || !dateTo) {
      return res.status(400).json({ message: 'Date range is required' })
    }

    const from = new Date(String(dateFrom))
    const to = new Date(String(dateTo))

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' })
    }

    // --- 1️⃣ Determine time grouping based on range ---
    const diffDays = Math.ceil(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
    )

    let groupBy: 'day' | 'week' | 'month' | 'year'
    if (diffDays <= 7) groupBy = 'day'
    else if (diffDays <= 30) groupBy = 'week'
    else if (diffDays <= 365) groupBy = 'month'
    else groupBy = 'year'

    // --- 2️⃣ Build group format ---
    let dateGroup: Record<string, any>
    switch (groupBy) {
      case 'day':
        dateGroup = {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        }
        break
      case 'week':
        dateGroup = {
          $concat: [
            { $toString: { $isoWeekYear: '$createdAt' } },
            '-W',
            { $toString: { $isoWeek: '$createdAt' } },
          ],
        }
        break
      case 'month':
        dateGroup = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
        break
      case 'year':
        dateGroup = { $dateToString: { format: '%Y', date: '$createdAt' } }
        break
    }

    // --- 3️⃣ Aggregate grouped data for the chart ---
    const summary = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: dateGroup,
          totalSales: {
            $sum: {
              $cond: [{ $eq: ['$isProfit', true] }, '$totalAmount', 0],
            },
          },
          totalPurchases: {
            $sum: {
              $cond: [{ $eq: ['$isProfit', false] }, '$totalAmount', 0],
            },
          },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ['$totalSales', '$totalPurchases'] },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalSales: 1,
          totalPurchases: 1,
          profit: 1,
        },
      },
    ])

    // --- 4️⃣ Aggregate overall totals for the whole range ---
    const totals = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: {
              $cond: [{ $eq: ['$isProfit', true] }, '$totalAmount', 0],
            },
          },
          totalPurchases: {
            $sum: {
              $cond: [{ $eq: ['$isProfit', false] }, '$totalAmount', 0],
            },
          },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ['$totalSales', '$totalPurchases'] },
        },
      },
      {
        $project: {
          _id: 0,
          totalSales: 1,
          totalPurchases: 1,
          profit: 1,
        },
      },
    ])

    res.status(200).json({
      groupBy,
      from,
      to,
      bars: summary, // for bar chart
      totals: totals[0] || { totalSales: 0, totalPurchases: 0, profit: 0 }, // for pie chart
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
