import mongoose, { Schema } from 'mongoose'

export interface IProduct extends Document {
  _id: string
  name: string
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
    seoTitle: { type: String },
    picture: { type: String },
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
