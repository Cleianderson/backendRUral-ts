import axios from 'axios'
import moment from 'moment'

import { Warning } from '~/models/Warning'

export async function createWarning (req, res) {
  let { title, content, endDate, testing } = req.body as { title: string, content: string, endDate: string | Date, testing: boolean }
  endDate = endDate || moment().add(1, 'weeks').toString()
  const newWarn = await Warning.create({ title, content, endDate })
  const allWarns = await Warning.find()

  let dataOneSignal = {
    app_id: '9cf90441-8151-4e1a-91a5-ce90b102410c',
    contents: { en: content, pt: content },
    heading: { en: title, pt: title },
    data: { ...allWarns },
    included_segments: ['Dev'],
    excluded_segments: ['All']
  }
  
  if(process.env.NODE_ENV === 'development') {
    dataOneSignal = { 
      ...dataOneSignal,
      app_id: '85b3451d-6f7d-481f-b66e-1f93fe069135',
      included_segments: ['All'],
      excluded_segments: []
    }
  }

  const optionsOneSignal = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${process.env.REST_API_KEY_ONE_SIGNAL}`
    }
  }
  if(testing === false || testing === undefined){
    const resolve = await axios.post(
      'https://onesignal.com/api/v1/notifications',
       dataOneSignal,
       optionsOneSignal,
       )
    return res.status(resolve.status).json({ ...dataOneSignal })
  } else {
    return res.status(200).json({ ...dataOneSignal })
  }
}

export async function getWarnings (req, res) {
  const allWarns = await Warning.find()
  const currentDate = moment().toISOString()

  const warnsFilteredByEndDate = allWarns.filter(warn => {
    if (moment(warn.endDate).isSameOrAfter(currentDate)) {
      Warning.findOneAndDelete({ _id: warn._id })
      return true
    }
    return false
  })

  return res.status(200).json(warnsFilteredByEndDate)
}

export async function deleteWarning (req, res) {
  const warnDeleted = await Warning.findByIdAndDelete(req.query.id)
  return res.status(200).json(warnDeleted)
}
