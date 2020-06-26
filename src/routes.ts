import { Router } from 'express'
import multer from 'multer'

import { createTable, createTablePassingWeek, getSortedTables, getTable } from '~/controllers/Table'
import { validateUserByPassword } from '~/controllers/User'
import { createWarning, deleteWarning, getWarnings } from '~/controllers/Warning'
import { createSuggestion, deleteSuggestion, getSuggestions, toggleSuggestionView } from '~/controllers/Suggestion'
import { createQuestion, getQuestions, deleteQuestion, updateQuestion } from '~/controllers/Question'
import { parseExcelFilesToWeekData } from '~/controllers/XlsxParser'

const upload = multer()
const route = Router()

route.get('/weeks', getSortedTables)
route.get('/thisweek', getTable)
route.get('/suggestions', getSuggestions)
route.get('/warn', getWarnings)
route.get('/questions', getQuestions)

route.post('/thisweek', validateUserByPassword, createTable)
route.post('/schedule', validateUserByPassword, createTablePassingWeek)
route.post('/suggestion', createSuggestion)
route.post('/toggleSuggestion', validateUserByPassword, toggleSuggestionView)
route.post('/questions', validateUserByPassword, createQuestion)
route.post('/warn', validateUserByPassword, createWarning)
route.post('/parse', upload.array('files', 2), parseExcelFilesToWeekData)

route.delete('/warn', validateUserByPassword, deleteWarning)
route.delete('/suggestions', validateUserByPassword, deleteSuggestion)
route.delete('/questions', validateUserByPassword, deleteQuestion)

route.put('/questions', validateUserByPassword, updateQuestion)

export default route
