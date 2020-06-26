import mongoose from 'mongoose'
import request from 'supertest'

import app from '~/app'
import { createUserToTest } from './config'

const tableData = {
  week: [
    {
      almoco: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sco: '', sal: '' },
      jantar: { suc: '', p1: '', p2: '', gua: '', sob: '', sopa: '', veg: '', gre: '', fag: '', sal: '' }
    },
    {
      almoco: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sco: '', sal: '' },
      jantar: { suc: '', p1: '', p2: '', gua: '', sob: '', sopa: '', veg: '', gre: '', fag: '', sal: '' }
    },
    {
      almoco: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sco: '', sal: '' },
      jantar: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sal: '' }
    },
    {
      almoco: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sco: '', sal: '' },
      jantar: { suc: '', p1: '', p2: '', gua: '', sob: '', sopa: '', veg: '', gre: '', fag: '', sal: '' }
    },
    {
      almoco: { suc: '', p1: '', p2: '', gua: '', sob: '', veg: '', gre: '', fag: '', sco: '', sal: '' },
      jantar: { suc: '', p1: '', p2: '', gua: '', sob: '', sopa: '', veg: '', gre: '', fag: '', sal: '' }
    }
  ],
  number_week: 40,
  year: 2000
}

createUserToTest('testTable')

describe('Test table paths', () => {
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

  it('schedule table successfully', async () => {
    const responseWithoutPass = await request(app).post('/schedule').send({ ...tableData }).query(
      { number_week: tableData.number_week }
    )

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const response = await request(app).post('/schedule').send({ ...tableData, pass: 'testTable' }).query(
      { number_week: tableData.number_week }
    )
    const validTable = response.body

    expect(response.status).toBe(200)
    expect(validTable._id).toBeDefined()
    expect(validTable.data).toStrictEqual(tableData.week)
    expect(validTable.number_week).toBe(tableData.number_week)
    expect(validTable.year).toBeDefined()
  })

  it('create table successfully', async () => {
    const responseWithoutPass = await request(app).post('/thisweek').send({ ...tableData })

    expect(responseWithoutPass.status).toBe(400)
    expect(responseWithoutPass.body.error).toBe('Invalid Password')

    const response = await request(app).post('/thisweek').send({ ...tableData, pass: 'testTable' })
    const validTable = response.body

    expect(response.status).toBe(200)
    expect(validTable._id).toBeDefined()
    expect(validTable.data).toStrictEqual(tableData.week)
    expect(validTable.number_week).toBeDefined()
    expect(validTable.year).toBeDefined()
  })

  it('getting all tables successfully', async () => {
    const resolveGetAllTables = await request(app).get('/weeks')
    const tables = resolveGetAllTables.body

    expect(resolveGetAllTables.status).toBe(200)
    expect(tables.length).toBeGreaterThan(0)
  })

  it('getting a table successfully', async () => {
    const resolveGetTable = await request(app).get('/thisweek')
    const table = resolveGetTable.body

    expect(resolveGetTable.status).toBe(200)
    expect(table._id).toBeDefined()
  })
})
