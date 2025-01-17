import express from 'express'
import {
  saveEnquiryRequest,
  getCommunicationListByProtocolId,
  getCommunicationListByProtocolIdForPdf
} from '../controllers/communication.js'

const router = express.Router()

router.post('/saveEnquiry', saveEnquiryRequest)
router.post(
  '/getCommunicationListByProtocolId',
  getCommunicationListByProtocolId
)
router.post(
  '/getCommunicationListByProtocolIdForPdf',
  getCommunicationListByProtocolIdForPdf
)

export default router
