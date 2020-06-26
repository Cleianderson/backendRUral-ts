import moment from 'moment'

import { TableModel } from '~/models/Table'

export async function getSortedTables (req, res) {
  const tables = await TableModel.find()
  const sortedTable = tables.sort((a, b) => {
    if (a.year === b.year) {
      if (a.number_week < b.number_week) return 1
      if (a.number_week === b.number_week) return 0
      if (a.number_week > b.number_week) return -1
    } else {
      if (a.number_week < b.number_week) return -1
      if (a.number_week === b.number_week) return 0
      if (a.number_week > b.number_week) return 1
    }
  })
  return res.status(200).json(sortedTable)
}

export async function getTable (req, res) {
  let table = { data: null }
  const { week } = req.query

  if (week) {
    table = await TableModel.findOne({ number_week: req.query.week, year: moment().year() })
  } else {
    table = await TableModel.findOne({ number_week: moment().isoWeek(), year: moment().year() })
  }
  return res.status(200).json(table)
}

export async function createTable (req, res) {
  const tableFromDatabase = await TableModel.findOne({ number_week: moment().isoWeek(), year: moment().year() })

  try {
    if (tableFromDatabase === null) {
      const tableCreated = await TableModel.create({
        data: req.body.week, number_week: moment().isoWeek(), year: moment().year()
      })

      return res.status(200).json(tableCreated)
    } else {
      tableFromDatabase.data = req.body.week
      tableFromDatabase.save()

      return res.status(200).json(tableFromDatabase)
    }
  } catch (err) {
    return res.status(400).json({ error: 'Error' })
  }
}

export async function createTablePassingWeek (req, res) {
  // eslint-disable-next-line camelcase
  const { number_week } = req.query
  const tableFromDatabase = await TableModel.findOne({ number_week, year: moment().year() })

  if (tableFromDatabase === null) {
    const tableCreated = await TableModel.create({
      data: req.body.week, number_week: req.query.number_week, year: moment().year()
    })
    return res.status(200).json(tableCreated)
  } else {
    tableFromDatabase.data = req.body.week
    tableFromDatabase.save()
    return res.status(200).json(tableFromDatabase)
  }
}
