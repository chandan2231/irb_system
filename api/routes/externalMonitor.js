import express from 'express'
import { getExternalMonitorProtocolList } from '../controllers/externalMonitor.js'
const router = express.Router()

router.post('/protocol/list', getExternalMonitorProtocolList)

export default router
