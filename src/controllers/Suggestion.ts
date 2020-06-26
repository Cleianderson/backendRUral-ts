import { SuggestionModel } from '~/models/Suggestion'

export async function createSuggestion (req, res) {
  let { text, type, author } = req.body as {text: string, type: string, author: string}
  author = author || 'Anonymous'
  const suggestionCreated = await SuggestionModel.create({ suggestion: text, type, author })
  return res.status(200).json(suggestionCreated)
}

export async function deleteSuggestion (req, res) {
  const suggestionDeleted = await SuggestionModel.findByIdAndDelete(req.query.id)
  return res.status(200).json(suggestionDeleted)
}

export async function getSuggestions (req, res) {
  const suggestions = await SuggestionModel.find()
  return res.status(200).json(suggestions)
}

export async function toggleSuggestionView (req, res) {
  const sug = await SuggestionModel.findById(req.body.id)
  sug.viewed = !sug.viewed
  sug.save()
  return res.status(200).json(sug)
}
