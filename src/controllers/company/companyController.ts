import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import {
  Company,
  Expenses,
  Position,
  Policy,
} from '../../models/company/companyModel'
import { IExpenses, IPosition, IPolicy } from '../../utils/teamInterface'
import {
  queryData,
  updateItem,
  createItem,
  deleteItem,
} from '../../utils/query'

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.id) {
      const company = await Company.findByIdAndUpdate(req.body.id, req.body, {
        upsert: true,
        new: true,
      })
      res.status(200).json({ company })
    } else {
      const company = await Company.create(req.body)
      res.status(200).json({ company })
    }
  } catch (error) {
    console.log(error)
  }
}

export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Company.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Company not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getCompany = async (req: Request, res: Response) => {
  try {
    const company = await Company.findOne()
    res.status(200).json({ company })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------TERMS & CONDITIONS--------------------//
export const createPolicy = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Policy, 'Policy was created successfully')
}

export const getPolicyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Policy.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Policy not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPolcies = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPolicy>(Policy, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePolicy = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Policy,
      [],
      ['Policy not found', 'Policy was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deletePolicy = async (req: Request, res: Response) => {
  try {
    const result = await deleteItem(
      req,
      res,
      Policy,
      [],
      'Policy was updated successfully'
    )
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------EXPENSES--------------------//
export const createExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Expenses, 'Expenses was created successfully')
}

export const getExpensesById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Expenses.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Expenses not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IExpenses>(Expenses, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateExpenses = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Expenses,
      ['receipt'],
      ['Expenses not found', 'Expenses was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------POSITION--------------------//
export const createPosition = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Position, 'Position was created successfully')
}

export const getPositionById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Position.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Position not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPositions = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPosition>(Position, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePosition = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Position,
      [],
      ['Position not found', 'Position was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
