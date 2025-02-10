import { db } from '../connect.js'
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
      return_url: 'https://app.irbhub.org/success',
      cancel_url: 'https://app.irbhub.org/cancel'
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

// export const capturePayment = async (req, res) => {
//   console.log('req.body', req.body)
//   const { orderId, payerId } = req.body

//   const captureOrderRequest = new paypal.orders.OrdersCaptureRequest(orderId)
//   captureOrderRequest.requestBody({})

//   try {
//     const captureResult = await client().execute(captureOrderRequest)
//     // Store payment details in the database
//     const paymentData = {
//       payment_id: captureResult.result.id,
//       payer_id: payerId,
//       amount: req.body.amount,
//       currency: req.body.currencyCode,
//       status: captureResult.result.status,
//       protocol_id: req.body.protocolId
//     }

//     db.query('INSERT INTO transactions SET ?', paymentData, (err, result) => {
//       if (err) {
//         console.error(err)
//         res.status(500).send('Error storing payment in database')
//       } else {
//         const query =
//           'UPDATE protocols SET status = ?, allow_edit = ? WHERE protocol_id = ?'
//         const values = [2, 1, req.body.protocolId]
//         db.query(query, values, (err, result) => {
//           if (err) {
//             console.error(
//               'Error moving the protocol to under review status: ',
//               err
//             )
//             return
//           } else {
//             res.json({
//               message: 'Payment captured successfully',
//               captureResult
//             })
//           }
//         })
//       }
//     })
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Error capturing PayPal order')
//   }
// }

function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const capturePayment = async (req, res) => {
  const { orderId, payerId, amount, currencyCode, protocolId, researchType } =
    req.body

  const captureOrderRequest = new paypal.orders.OrdersCaptureRequest(orderId)
  captureOrderRequest.requestBody({
    payer_id: payerId // Ensure you are passing payer_id in the capture request
  })

  try {
    const captureResult = await client().execute(captureOrderRequest)

    // Store payment details in the database
    const paymentData = {
      payment_id: captureResult.result.id,
      payer_id: payerId,
      amount: amount,
      currency: currencyCode,
      status: captureResult.result.status,
      protocol_id: protocolId
    }

    db.query('INSERT INTO transactions SET ?', paymentData, (err, result) => {
      if (err) {
        console.error(err)
        return res.status(500).send('Error storing payment in database')
      }

      const updateQuery =
        'UPDATE protocols SET status = ?, allow_edit = ? WHERE protocol_id = ?'
      const updateValues = [2, 1, protocolId]
      db.query(updateQuery, updateValues, (err, result) => {
        if (err) {
          console.error('Error updating protocol status: ', err)
          return res.status(500).send('Error updating protocol status')
        }

        if (researchType === 'Multi-Site Sponsor') {
          let baseProtocolId = protocolId
          for (let i = 1; i <= 5; i++) {
            const newProtocolId = `${baseProtocolId}-${String(i).padStart(2, '0')}`
            const randomString = generateRandomString(10)
            const insertQuery =
              'INSERT INTO protocols (`protocol_id`, `parent_protocol_id`, `research_type`, `status`, `varification_code`, `protocol_user_type`) VALUES (?)'
            const newGeneratedProtocol = [
              newProtocolId,
              baseProtocolId,
              'Clinical Site',
              2,
              randomString,
              'Clinical Site'
            ]
            // Execute the SQL query to insert the protocol ID
            db.query(insertQuery, [newGeneratedProtocol], (err, results) => {
              if (err) {
                console.error('Error inserting protocol ID:', err)
              } else {
                console.log(`Inserted Protocol ID: ${newProtocolId}`)
              }
            })
          }
        }

        // Respond back with the capture result
        return res.json({
          message: 'Payment captured successfully',
          captureResult
        })
      })
    })
  } catch (error) {
    console.error('Error capturing PayPal order: ', error)
    return res.status(500).send('Error capturing PayPal order')
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
