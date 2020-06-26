import mongoose from 'mongoose'

type SuggestionSchema = { suggestion: string, type: string, viewed?: boolean, author?: string } & mongoose.Document

const suggestionSchema = new mongoose.Schema({
  suggestion: { type: String, required: true },
  type: { type: String, required: true },
  viewed: { type: Boolean, default: false },
  author: { type: String, required: false, default: 'Anonymous' }
},
{ timestamps: true }
)

export const SuggestionModel = mongoose.model<SuggestionSchema>('Suggestion', suggestionSchema)
