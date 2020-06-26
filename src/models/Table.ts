import mongoose from 'mongoose'

// eslint-disable-next-line camelcase
type TableSchema = { data: object[], number_week: number, year: number } & mongoose.Document

const tableSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true,
    validate: {
      validator: (data) => {
        const keysSampleLaunch = ['suc', 'p1', 'p2', 'gua', 'sob', 'veg', 'gre', 'fag', 'sco', 'sal']
        const keysSampleDinner = ['suc', 'p1', 'p2', 'gua', 'sob', 'veg', 'gre', 'fag', 'sopa', 'sal']

        let isEqualSampleLaunch: boolean
        let isEqualSampleDinner: boolean

        for (const dayWeek of data) {
          isEqualSampleLaunch = keysSampleLaunch.every(val => Object.keys(dayWeek.almoco).includes(val))
          isEqualSampleDinner = keysSampleDinner.every(val => Object.keys(dayWeek.jantar).includes(val))
        }
        return isEqualSampleLaunch && isEqualSampleDinner
      },
      message: () => 'the table dont includes all items'
    }
  },
  number_week: { type: Number, required: true },
  year: { type: Number, required: true }
}, { timestamps: true })

export const TableModel = mongoose.model<TableSchema>('Table', tableSchema)
