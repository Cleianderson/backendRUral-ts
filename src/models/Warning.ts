import mongoose from 'mongoose'

type WarningSchema = {
  title: string,
  content: string,
  endDate: Date | string,
} & mongoose.Document

const schemaWarning = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  endDate: { type: Date, required: true }
}, { timestamps: true })

export const Warning = mongoose.model<WarningSchema>('Warning', schemaWarning)
