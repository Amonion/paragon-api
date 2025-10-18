import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../../models/users/user'
dotenv.config()

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password) {
      res
        .status(404)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '30d' }
    )

    user.password = undefined

    res.status(200).json({
      message: 'Login successful',
      user,
      token,
    })
  } catch (error: unknown) {
    handleError(res, undefined, undefined, error)
  }
}

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      userId: string
      email: string
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user,
    })
  } catch (error: unknown) {
    res.status(401).json({ message: 'Unauthorized', error })
  }
}

export const getAuthUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '30d' }
    )
    res.status(200).json({
      message: 'Login successful',
      user: user,
      token,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const fogottenPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res
        .status(404)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    if (!user.password) {
      res.status(400).json({ message: 'Password not set for user' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    // const token = jwt.sign(
    //   { userId: user._id, email: user.email },
    //   JWT_SECRET,
    //   { expiresIn: "30d" }
    // );

    // res.status(200).json({
    //   message: "Login successful",
    //   user: {
    //     email: user.email,
    //     username: user.username,
    //     phone: user.phone,
    //   },
    //   token,
    // });
  } catch (error: unknown) {
    handleError(res, undefined, undefined, error)
  }
}
