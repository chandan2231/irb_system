import express from 'express'
import {
  saveEnquiryRequest,
  getCommunicationListByProtocolId
} from '../controllers/communication.js'

const router = express.Router()

router.post('/saveEnquiry', saveEnquiryRequest)
router.post(
  '/getCommunicationListByProtocolId',
  getCommunicationListByProtocolId
)

export default router
