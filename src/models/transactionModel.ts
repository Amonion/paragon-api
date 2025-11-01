import mongoose, { Schema } from 'mongoose'

export interface ITransaction extends Document {
  _id: string
  fullName: string
  username: string
  status: string
  nature: string
  picture: string
  createdAt: Date
}

const TransactionSchema: Schema = new Schema(
  {
    fullName: { type: String },
    username: { type: String },
    picture: { type: String },
    payment: { type: String },
    totalAmount: { type: Number },
    nature: { type: String },
    status: { type: Boolean },
    isProfit: { type: Boolean, default: false },
    cartProducts: { type: Array },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
)
