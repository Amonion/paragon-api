"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTransactionSummary = exports.updateTransaction = exports.getTransactions = exports.CreateTrasanction = exports.purchaseProducts = void 0;
const query_1 = require("../utils/query");
const errorHandler_1 = require("../utils/errorHandler");
const transactionModel_1 = require("../models/transactionModel");
const productModel_1 = require("../models/productModel");
const purchaseProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartProducts = req.body.cartProducts;
        if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const productIds = cartProducts.map((p) => p._id);
        const dbProducts = yield productModel_1.Product.find({ _id: { $in: productIds } });
        if (dbProducts.length !== productIds.length) {
            const missingIds = productIds.filter((id) => !dbProducts.find((p) => p._id.toString() === id.toString()));
            return res.status(404).json({
                message: `Some products were not found: ${missingIds.join(', ')}`,
            });
        }
        const bulkOps = cartProducts.map((cartItem) => ({
            updateOne: {
                filter: { _id: cartItem._id },
                update: {
                    $inc: { units: cartItem.cartUnits * (cartItem.unitPerPurchase || 1) },
                },
            },
        }));
        yield productModel_1.Product.bulkWrite(bulkOps);
        yield transactionModel_1.Transaction.create(req.body);
        const result = yield (0, query_1.queryData)(productModel_1.Product, req);
        res.status(200).json({
            message: 'Product purchase has been successfully recorded.',
            result,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.purchaseProducts = purchaseProducts;
const CreateTrasanction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartProducts = req.body.cartProducts;
        if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        const productIds = cartProducts.map((p) => p._id);
        const dbProducts = yield productModel_1.Product.find({ _id: { $in: productIds } });
        if (dbProducts.length !== productIds.length) {
            const missingIds = productIds.filter((id) => !dbProducts.find((p) => p._id.toString() === id.toString()));
            return res.status(404).json({
                message: `Some products were not found: ${missingIds.join(', ')}`,
            });
        }
        const outOfStock = [];
        for (const cartItem of cartProducts) {
            const product = dbProducts.find((p) => p._id.toString() === cartItem._id.toString());
            if (!product)
                continue;
            if (product.units < cartItem.cartUnits * cartItem.unitPerPurchase) {
                outOfStock.push({
                    name: product.name,
                    available: product.units,
                    requested: cartItem.cartUnits,
                });
            }
        }
        if (outOfStock.length > 0) {
            return res.status(400).json({
                message: 'Some items are out of stock. Please adjust your order and try again.',
                outOfStock,
            });
        }
        const bulkOps = cartProducts.map((cartItem) => ({
            updateOne: {
                filter: { _id: cartItem._id },
                update: {
                    $inc: { units: -cartItem.cartUnits * cartItem.unitPerPurchase },
                },
            },
        }));
        yield productModel_1.Product.bulkWrite(bulkOps);
        yield transactionModel_1.Transaction.create(req.body);
        const result = yield (0, query_1.queryData)(productModel_1.Product, req);
        res.status(200).json({
            message: 'The transaction has been created successfully.',
            result,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.CreateTrasanction = CreateTrasanction;
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(transactionModel_1.Transaction, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getTransactions = getTransactions;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transactionModel_1.Transaction.findByIdAndUpdate(req.params.id, req.body);
        const result = yield (0, query_1.queryData)(transactionModel_1.Transaction, req);
        res.status(200).json({
            message: 'The transaction has been updated successfully.',
            result,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateTransaction = updateTransaction;
const GetTransactionSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { dateFrom, dateTo } = req.query;
        if (!dateFrom || !dateTo) {
            return res.status(400).json({ message: 'Date range is required' });
        }
        const from = new Date(String(dateFrom));
        const to = new Date(String(dateTo));
        if (isNaN(from.getTime()) || isNaN(to.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        // --- 1️⃣ Determine time grouping based on range ---
        const diffDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
        let groupBy;
        if (diffDays <= 7)
            groupBy = 'day';
        else if (diffDays <= 30)
            groupBy = 'week';
        else if (diffDays <= 365)
            groupBy = 'month';
        else
            groupBy = 'year';
        // --- 2️⃣ Build group format ---
        let dateGroup;
        switch (groupBy) {
            case 'day':
                dateGroup = {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                };
                break;
            case 'week':
                dateGroup = {
                    $concat: [
                        { $toString: { $isoWeekYear: '$createdAt' } },
                        '-W',
                        { $toString: { $isoWeek: '$createdAt' } },
                    ],
                };
                break;
            case 'month':
                dateGroup = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            case 'year':
                dateGroup = { $dateToString: { format: '%Y', date: '$createdAt' } };
                break;
        }
        // --- 3️⃣ Aggregate grouped data for the chart ---
        const summary = yield transactionModel_1.Transaction.aggregate([
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
        ]);
        // --- 4️⃣ Aggregate overall totals for the whole range ---
        const totals = yield transactionModel_1.Transaction.aggregate([
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
        ]);
        res.status(200).json({
            groupBy,
            from,
            to,
            bars: summary, // for bar chart
            totals: totals[0] || { totalSales: 0, totalPurchases: 0, profit: 0 }, // for pie chart
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.GetTransactionSummary = GetTransactionSummary;
