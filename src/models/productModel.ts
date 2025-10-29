import mongoose, { Schema } from 'mongoose'

export interface IProduct extends Document {
  _id: string
  name: string
  purchaseUnit: string
  units: number
  unitPerPurchase: number
  discount: number
  costPrice: number
  price: number
  description: string
  picture: string
  createdAt: Date
  seoTitle: string
}

const ProductSchema: Schema = new Schema(
  {
    description: { type: String },
    name: { type: String },
    purchaseUnit: { type: String },
    seoTitle: { type: String },
    picture: { type: String },
    units: { type: Number },
    unitPerPurchase: { type: Number, default: 1 },
    price: { type: Number },
    discount: { type: Number },
    costPrice: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Product = mongoose.model<IProduct>('Product', ProductSchema)

export interface IStocking extends Document {
  _id: string
  name: string
  units: number
  picture: string
  reason: string
  productId: string
  video: string
  amount: number
  isProfit: boolean
}

const StockingSchema: Schema = new Schema(
  {
    staffName: { type: String },
    name: { type: String },
    picture: { type: String },
    reason: { type: String },
    units: { type: Number },
    productId: { type: String },
    video: { type: String },
    amount: { type: Number },
    isProfit: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Stocking = mongoose.model<IStocking>('Stocking', StockingSchema)
