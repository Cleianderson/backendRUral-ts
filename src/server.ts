import mongoose from 'mongoose'

import app from './app'

mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
const mongoConnection = mongoose.connection
mongoConnection.on('open', () => {
  console.log('Connected to MongoDB')
})

app.listen(process.env.PORT || 2222, () => {
  console.info(`Server running with NODE_ENV = ${process.env.NODE_ENV}\n\rNODE_ENV === \'development\' is ${process.env.NODE_ENV === 'development'}`)
})
