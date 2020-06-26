import mongoose from 'mongoose'

type QuestionSchemma = {
  question: string
  answer: string
  author?: string
  theme: string
  relevation: number
} & mongoose.Document

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    author: { type: String, default: 'Unknown' },
    theme: { type: String, required: true },
    relevation: { type: Number, required: true, min: 0, max: 6 }
  },
  { timestamps: true }
)

export const QuestionModel = mongoose.model<QuestionSchemma>('Questions', questionSchema)
