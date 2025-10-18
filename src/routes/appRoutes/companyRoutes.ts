import express from 'express'
import multer from 'multer'
import {
  createExpenses,
  createPolicy,
  createPosition,
  deletePolicy,
  getCompany,
  getExpenses,
  getExpensesById,
  getPolcies,
  getPolicyById,
  getPositionById,
  getPositions,
  updateCompany,
  updateExpenses,
  updatePolicy,
  updatePosition,
} from '../../controllers/company/companyController'
const upload = multer()

const router = express.Router()

router.route('/').get(getCompany).patch(upload.any(), updateCompany)
router.route('/policy').get(getPolcies).post(upload.any(), createPolicy)
router.route('/expenses').get(getExpenses).post(upload.any(), createExpenses)
router.route('/positions').get(getPositions).post(upload.any(), createPosition)

router
  .route('/positions/:id')
  .get(getPositionById)
  .patch(upload.any(), updatePosition)
router
  .route('/policy/:id')
  .get(getPolicyById)
  .patch(upload.any(), updatePolicy)
  .delete(deletePolicy)

router
  .route('/expenses/:id')
  .get(getExpensesById)
  .patch(upload.any(), updateExpenses)

export default router
