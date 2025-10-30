import express from 'express'
import multer from 'multer'
import {
  getStaffs,
  MakeStaffUsers,
  MakeUserStaff,
} from '../controllers/staffController'
const upload = multer()

const router = express.Router()

router.route('/make-staff').patch(upload.any(), MakeUserStaff)
router.route('/make-user').patch(MakeStaffUsers)

router.route('/').get(getStaffs)

export default router
