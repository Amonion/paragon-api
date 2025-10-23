import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  loginUser,
  getCurrentUser,
} from '../../controllers/users/authController'
import {
  getAUser,
  getUsers,
  updateUser,
  createUser,
  getExistingUsername,
  searchAccounts,
} from '../../controllers/users/userController'

const router = express.Router()
router.route('/create-account')
router.route('/username/:username').get(getExistingUsername)
router.route('/login').post(upload.any(), loginUser)

router.route('/auth').get(getCurrentUser)

router.route('/accounts').get(searchAccounts)
router.route('/:username').get(getAUser).patch(upload.any(), updateUser)
router.route('/').get(getUsers).post(upload.any(), createUser)

export default router
