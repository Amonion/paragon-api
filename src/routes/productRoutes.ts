import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createProduct,
  getAProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from '../controllers/productController'

const router = express.Router()

router.route('/search').get(searchProducts)
router.route('/:id').get(getAProduct).patch(upload.any(), updateProduct)
router.route('/').get(getProducts).post(upload.any(), createProduct)

export default router
