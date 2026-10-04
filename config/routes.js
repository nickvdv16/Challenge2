import express from 'express'
import messagesRouter from '../routes/api/v1/messages.js'

const router = express.Router()

router.use('/api/v1/messages', messagesRouter)

export default router