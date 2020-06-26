import mongoose from 'mongoose'
import request from 'supertest'

import app from '~/app'
import { createUserToTest } from './config'

const warnData = { title: 'titleWarn', content: 'contentWarn', testing: true }

createUserToTest('testWarn')

describe('Test /warn path', () => {
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

  it('create warning successfully', async () => {
    const response = await request(app).post('/warn').send({ ...warnData, pass: 'testWarn' })
    const validWarn = response.body.warning

    const responseWithoutPass = await request(app).post('/questions').send({ ...warnData })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    expect(response.status).toBe(200)
    expect(validWarn._id).toBeDefined()
    expect(validWarn.title).toBe(warnData.title)
    expect(validWarn.content).toBe(warnData.content)
    expect(validWarn.endDate).toBeDefined()
  })

  it('getting all warnings successfully', async () => {
    const resolveAllWarn = await request(app).get('/warn')
    const warns = resolveAllWarn.body

    expect(resolveAllWarn.status).toBe(200)
    expect(warns.length).toBeGreaterThan(0)
  })

  it('delete question successfully', async () => {
    const responseAllWarn = await request(app).get('/warn')
    const firstWarn = responseAllWarn.body[0]

    const responseWithoutPass = await request(app).delete('/warn').query({ id: firstWarn._id })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const deletedResponse = await request(app).delete('/warn').query(
      { id: firstWarn._id, pass: 'testWarn' }
    )

    expect(deletedResponse.status).toBe(200)
    expect(deletedResponse.body._id).toBeDefined()
  })
})
