import express from 'express'
import {
  getPaymentAmountInfo,
  createPayment,
  capturePayment,
  successPayment,
  canclePayment,
  getTransactionListByType
} from '../controllers/payment.js'

const router = express.Router()

router.post('/getPaymentAmountInfo', getPaymentAmountInfo)
router.post('/createPayment', createPayment)
router.post('/capturePayment', capturePayment)
router.post('/successPayment', successPayment)
router.post('/canclePayment', canclePayment)
router.post('/transaction', getTransactionListByType)

export default router
