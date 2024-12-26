import express from 'express'
import { saveEnquiryRequest } from '../controllers/communication.js'

const router = express.Router()

router.post('/saveEnquiry', saveEnquiryRequest)

export default router
