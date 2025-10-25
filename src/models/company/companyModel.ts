import mongoose, { Schema } from 'mongoose'
import { IExpenses, IPosition, IPolicy } from '../../utils/teamInterface'

export interface ICompany extends Document {
  name: string
  domain: string
  email: string
  documents: string
  finalInstruction: string
  phone: string
  allowSignup: boolean
  headqauters: string
  newVersion: string
  newVersionLink: string
  createdAt: Date
}

const PositionSchema: Schema = new Schema(
  {
    role: { type: String },
    position: { type: String },
    duties: { type: String },
    level: { type: Number },
    salary: { type: Number },
    allowSignup: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Position = mongoose.model<IPosition>('Position', PositionSchema)

const CompanySchema: Schema = new Schema(
  {
    name: { type: String },
    domain: { type: String },
    email: { type: String },
    documents: { type: String },
    finalInstruction: { type: String },
    welcomeMessage: { type: String },
    phone: { type: String },
    headquaters: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    bankAccountName: { type: String },
    allowSignUp: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Company = mongoose.model<ICompany>('Company', CompanySchema)

const PolicySchema: Schema = new Schema(
  {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Policy = mongoose.model<IPolicy>('Policy', PolicySchema)

const ExpensesSchema: Schema = new Schema(
  {
    name: { type: String },
    amount: { type: Number },
    receipt: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Expenses = mongoose.model<IExpenses>('Expenses', ExpensesSchema)
