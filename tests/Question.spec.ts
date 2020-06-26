import mongoose from 'mongoose'
import request from 'supertest'

import app from '~/app'
import { createUserToTest } from './config'

const questionData = { question: 'questionText', answer: 'answerSuggestion', theme: 'themeQuestion' }

createUserToTest()

describe('Test /questions path', () => {
  let connection
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      })
    connection = mongoose.connection
  })

  afterAll(async () => {
    await connection.close()
  })

  it('create question successfully', async () => {
    const responseWithoutPass = await request(app).post('/questions').send({ ...questionData })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const response = await request(app).post('/questions').send({ ...questionData, pass: 'testPass' })
    const validSuggestion = response.body

    expect(response.status).toBe(200)
    expect(validSuggestion._id).toBeDefined()
    expect(validSuggestion.author).toBe('Unknow')
    expect(validSuggestion.theme).toBe('themeQuestion')
    expect(validSuggestion.question).toBe(questionData.question)
    expect(validSuggestion.answer).toBe(questionData.answer)
    expect(validSuggestion.relevation).toBe(0)
  })

  it('getting all questions successfully', async () => {
    const resolveGetAllQuestion = await request(app).get('/questions')
    const questions = resolveGetAllQuestion.body

    expect(resolveGetAllQuestion.status).toBe(200)
    expect(questions.length).toBeGreaterThan(0)
  })

  it('update question successfully', async () => {
    const resolveGetAllQuestions = await request(app).get('/questions')
    const firstQuestion = resolveGetAllQuestions.body[0]

    const responseWithoutPass = await request(app).put('/questions').send({ ...questionData, id: firstQuestion._id })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const resolveUpdatedQuestion = await request(app).put('/questions').send(
      {
        pass: 'testPass',
        id: firstQuestion._id,
        author: 'author2',
        theme: 'theme2',
        question: 'question2',
        answer: 'answer2',
        relevation: 6
      }
    )
    const updatedQuestion = resolveUpdatedQuestion.body

    expect(resolveUpdatedQuestion.status).toBe(200)
    expect(updatedQuestion.author).toBe('author2')
    expect(updatedQuestion.theme).toBe('theme2')
    expect(updatedQuestion.question).toBe('question2')
    expect(updatedQuestion.answer).toBe('answer2')
    expect(updatedQuestion.relevation).toBe(6)
  })

  it('delete question successfully', async () => {
    const responseQuestion = await request(app).get('/questions')
    const firstQuestion = responseQuestion.body[0]

    const responseWithoutPass = await request(app).delete('/questions').query({ id: firstQuestion._id })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const deletedResponse = await request(app).delete('/questions').query(
      { id: firstQuestion._id, pass: 'testPass' }
    )

    expect(deletedResponse.status).toBe(200)
    expect(deletedResponse.body._id).toBeDefined()
  })
})
