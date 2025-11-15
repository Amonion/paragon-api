import express from 'express'
import multer from 'multer'
import {
  createTrasanction,
  getTransactions,
  GetTransactionSummary,
  purchaseProducts,
  updateTransaction,
} from '../controllers/transactionController'
const upload = multer()

const router = express.Router()

router.route('/').get(getTransactions).post(upload.any(), createTrasanction)
router.route('/purchase').post(purchaseProducts)
router.route('/barchart').get(GetTransactionSummary)
router.route('/:id').patch(upload.any(), updateTransaction)

export default router
