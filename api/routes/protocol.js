import express from 'express'
import { upload } from '../utils/middleware.js'
import {
  saveFile,
  continueinReviewGeneratePdf,
  protocolGeneratePdf,
  getProtocolList,
  createProtocol,
  getApprovedProtocolCheck,
  getApprovedProtocolList,
  checkMultisiteProtocolExist,
  multiSiteChildProtocolsList,
  createExternalMonitor,
  getExternalMonitorList,
  createCRC,
  getCRCList
} from '../controllers/protocol.js'

const router = express.Router()
router.post('/multiSiteChildProtocolsList', multiSiteChildProtocolsList)
router.post('/checkMultisiteProtocolExist', checkMultisiteProtocolExist)
router.post('/approvedListCheck', getApprovedProtocolCheck)
router.post('/approved/list', getApprovedProtocolList)
router.post('/list', getProtocolList)
router.post('/create', createProtocol)
router.post('/upload/file', upload.single('file'), saveFile)
router.post('/continuein/generate/pdf', continueinReviewGeneratePdf)
router.post('/protocol/generate/pdf', protocolGeneratePdf)
router.post('/createExternalMonitor', createExternalMonitor)
router.post('/external/monitor/list', getExternalMonitorList)
router.post('/createCRC', createCRC)
router.post('/crc/list', getCRCList)

export default router
