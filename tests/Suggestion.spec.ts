import mongoose from 'mongoose'
import request from 'supertest'

import app from '~/app'
import { createUserToTest } from './config'

const suggestionData = { text: 'suggestionText', author: 'authorSuggestion', type: 'typeSuggestion' }

createUserToTest('sugPass')

describe('Test /suggestion path', () => {
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

  it('create suggestions successfully', async () => {
    const responseWithoutPass = await request(app).post('/questions').send({ ...suggestionData })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const response = await request(app).post('/suggestion').send(suggestionData)
    const validSuggestion = response.body

    expect(response.status).toBe(200)
    expect(validSuggestion._id).toBeDefined()
    expect(validSuggestion.viewed).toBeDefined()
    expect(validSuggestion.type).toBe(suggestionData.type)
    expect(validSuggestion.author).toBe(suggestionData.author)
    expect(validSuggestion.suggestion).toBe(suggestionData.text)
  })

  it('getting all suggestions successfully', async () => {
    const resolveGetAllSuggestions = await request(app).get('/suggestions')
    const suggestions = resolveGetAllSuggestions.body

    expect(resolveGetAllSuggestions.status).toBe(200)
    expect(suggestions.length).toBeGreaterThan(0)
  })

  it('toggle viewed suggestion successfully', async () => {
    const resolveGetAllSuggestions = await request(app).get('/suggestions')
    const firstSuggestion = resolveGetAllSuggestions.body[0]

    const responseWithoutPass = await request(app).post('/questions').send({ id: firstSuggestion._id })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const resolveToggle = await request(app).post('/toggleSuggestion').send({ pass: 'sugPass', id: firstSuggestion._id })
    const firstSuggestionToggled = resolveToggle.body

    expect(resolveToggle.status).toBe(200)
    expect(firstSuggestionToggled.viewed).toBe(!firstSuggestion.viewed)
  })

  it('delete suggestion successfully', async () => {
    const responseSuggestion = await request(app).get('/suggestions')
    const firstSuggestion = responseSuggestion.body[0]

    const deletedResponseWithoutPass = await request(app).delete('/suggestions').query({ id: firstSuggestion._id })

    expect(deletedResponseWithoutPass.status).toBe(400)
    expect(deletedResponseWithoutPass.body.error).toBe('Invalid Password')

    const deletedResponse = await request(app).delete('/suggestions').query(
      { id: firstSuggestion._id, pass: 'sugPass' }
    )

    expect(deletedResponse.status).toBe(200)
    expect(deletedResponse.body._id).toBeDefined()
    expect(deletedResponse.body.viewed).toBeDefined()
    expect(deletedResponse.body.type).toBe(suggestionData.type)
    expect(deletedResponse.body.author).toBe(suggestionData.author)
    expect(deletedResponse.body.suggestion).toBe(suggestionData.text)
  })
})
