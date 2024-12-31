import { db } from '../connect.js'
// const { client } = require('./paypalConfig')
// const paypal = require('@paypal/checkout-server-sdk')
import { client } from '../paypalConfig.js'
import paypal from '@paypal/checkout-server-sdk'

export const getPaymentAmountInfo = (req, res) => {
  const que = 'select * from event_price WHERE event_type=?'
  db.query(que, [req.body.paymentType.paymentType], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const createPayment = async (req, res) => {
  const createOrderRequest = new paypal.orders.OrdersCreateRequest()
  createOrderRequest.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: req.body.amount // Amount to charge the customer
        }
      }
    ],
    application_context: {
      return_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel'
    }
  })
  try {
    const order = await client().execute(createOrderRequest)
    const approvalUrl = order.result.links.find(
      (link) => link.rel === 'approve'
    ).href
    res.json({ approvalUrl })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating PayPal order')
  }
}

export const capturePayment = async (req, res) => {
  console.log('req.body', req.body)
  const { orderId, payerId } = req.body

  const captureOrderRequest = new paypal.orders.OrdersCaptureRequest(orderId)
  captureOrderRequest.requestBody({})

  try {
    const captureResult = await client().execute(captureOrderRequest)
    console.log('captureResult', captureResult)

    // Store payment details in the database
    const paymentData = {
      payment_id: captureResult.result.id,
      payer_id: payerId,
      amount: req.body.amount,
      currency: req.body.currencyCode,
      status: captureResult.result.status
    }

    db.query('INSERT INTO transactions SET ?', paymentData, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Error storing payment in database')
      } else {
        const query =
          'UPDATE protocols SET status = ?, allow_edit = ? WHERE protocol_id = ?'
        const values = [2, 1, req.body.protocolId]
        db.query(query, values, (err, result) => {
          if (err) {
            console.error(
              'Error moving the protocol to under review status: ',
              err
            )
            return
          } else {
            res.json({
              message: 'Payment captured successfully',
              captureResult
            })
          }
        })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error capturing PayPal order')
  }
}

export const successPayment = (req, res) => {
  let result = {}
  result.status = 200
  result.msg = 'Payment success'
  return res.json(result)
}

export const canclePayment = (req, res) => {
  let result = {}
  result.status = 200
  result.msg = 'Payment cancelled'
  return res.json(result)
}
