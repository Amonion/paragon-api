import { Request, Response } from 'express'
import { queryData } from '../utils/query'
import { handleError } from '../utils/errorHandler'
import { IUser, User } from '../models/users/userModel'
import { IStaff, Staff } from '../models/staffModel'

export const MakeUserStaff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.id,
      { status: 'Staff' },
      { new: true }
    )
    await Staff.create({
      username: user.username,
      name: user.fullName,
      picture: user.picture,
      phone: user.phone,
      email: user.email,
    })

    const result = await queryData<IUser>(User, req)
    res.status(200).json({
      message: 'The user has successfully been made staff.',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const MakeStaffUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const staff = await Staff.findByIdAndDelete(req.body.id)
    await User.findOneAndUpdate(
      {
        username: staff.username,
      },
      { status: 'User' }
    )

    const result = await queryData<IUser>(User, req)
    res.status(200).json({
      message: 'The User has been successfully made a user.',
      result,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getStaffs = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await queryData<IStaff>(Staff, req)
    res.status(200).json(result)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}
