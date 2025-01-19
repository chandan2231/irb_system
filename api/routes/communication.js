import express from 'express'
import {
  saveEnquiryRequest,
  getCommunicationListByProtocolId,
  downloadCommunicationPdf
} from '../controllers/communication.js'

const router = express.Router()

router.post('/saveEnquiry', saveEnquiryRequest)
router.post(
  '/getCommunicationListByProtocolId',
  getCommunicationListByProtocolId
)
router.post('/downloadCommunicationPdf', downloadCommunicationPdf)

export default router
