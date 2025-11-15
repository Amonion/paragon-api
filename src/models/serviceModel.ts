import mongoose, { Schema } from 'mongoose'

export interface IService extends Document {
  _id: string
  description: string
  title: string
  username: string
  staffName: string
  video: string
  createdAt: Date
}

const ServiceSchema: Schema = new Schema(
  {
    description: { type: String },
    staffName: { type: String },
    title: { type: String },
    video: { type: String },
    username: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Service = mongoose.model<IService>('Service', ServiceSchema)
