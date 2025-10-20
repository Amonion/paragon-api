import { Request, Response } from 'express'
import { IProduct, Product } from '../models/productModel'
import { queryData, search } from '../utils/query'
import { uploadFilesToS3 } from '../utils/fileUpload'
import { handleError } from '../utils/errorHandler'

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await Product.create(req.body)
    const result = await queryData<IProduct>(Product, req)
    res.status(200).json({
      message: 'User created successfully',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAProduct = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'product not found' })
    }

    res.status(200).json({ data: product })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) {
      return res.status(404).json({ message: 'product not found' })
    }

    res.status(200).json({
      message: 'The product is updated successfully',
      data: product,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IProduct>(Product, req)

    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchProducts = (req: Request, res: Response) => {
  return search(Product, req, res)
}
