import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getPersonalMessage,
  getPersonalMessages,
  readPersonalMessages,
} from '../../controllers/message/personalMessageController'

const router = express.Router()

router.route('/personal').get(getPersonalMessages)
router.route('/personal/read').patch(upload.any(), readPersonalMessages)
router.route('/personal/:id').get(getPersonalMessage)

export default router
