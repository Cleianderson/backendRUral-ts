import { QuestionModel } from '~/models/Question'

export async function createQuestion (req, res) {
  let { question, answer, theme, author, relevation } = req.body
  author = author || 'Unknow'
  relevation = relevation || 0

  const questionCreated = await QuestionModel.create({ question, answer, theme, author, relevation })

  return res.status(200).json(questionCreated)
}

export async function getQuestions (req, res) {
  const allQuestions = await QuestionModel.find()
  return res.status(200).json(allQuestions)
}

export async function updateQuestion (req, res) {
  const { id, question, answer, theme, relevation, author } = req.body

  const questionById = await QuestionModel.findById(id)

  if (question) questionById.question = question
  if (answer) questionById.answer = answer
  if (theme) questionById.theme = theme
  if (relevation) questionById.relevation = relevation
  if (author) questionById.author = author

  await questionById.save()

  return res.status(200).json(questionById)
}

export async function deleteQuestion (req, res) {
  const { id } = req.query

  const questionDeleted = await QuestionModel.findByIdAndDelete(id)
  return res.status(200).json(questionDeleted)
}
