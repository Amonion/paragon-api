import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, search } from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import bcrypt from 'bcryptjs'
import { sendEmail } from '../../utils/sendEmail'
import { IUser, User } from '../../models/users/user'
import { SocialNotification } from '../../models/message/socialNotificationModel'

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      phone: req.body.phone,
      fullName: req.body.fullName,
      password: await bcrypt.hash(req.body.password, 10),
    })
    await newUser.save()

    await sendEmail('', req.body.email, 'welcome')
    res.status(200).json({
      message: 'User created successfully',
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ data: user })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      message: 'Your profile was updated successfully',
      data: user,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchAccounts = (req: Request, res: Response) => {
  return search(User, req, res)
}

///////////// NEW CONTROLLERS //////////////
export const deleteMyData = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id)
    await SocialNotification.deleteMany({ userId: req.params.id })
    await User.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json({ message: 'Your account has been deleted successfully.' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUser>(User, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------INFO--------------------//
export const getExistingUsername = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
