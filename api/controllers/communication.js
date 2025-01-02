import { db } from '../connect.js'
import sendEmail from '../emailService.js'
import { getUserInfo } from '../userData.js'

export const saveEnquiryRequest = async (req, res) => {
  try {
    const datetime = new Date()
    const attachmentString = req.body.attachments_file
      ? req.body.attachments_file.join(',')
      : ''

    const que =
      'insert into communication (`protocol_id`, `attachments_id`, `protocol_type`, `subject`, `body`, `created_by_user_type`, `status`, `created_by`,`created_at`,`updated_at`) values (?)'
    const values = [
      req.body.protocol_id,
      attachmentString,
      req.body.protocol_type,
      req.body.subject,
      req.body.body,
      req.body.created_by_user_type,
      req.body.status,
      req.body.created_by,
      datetime.toISOString().slice(0, 10),
      datetime.toISOString().slice(0, 10)
    ]

    // Wrap the db query in a promise to use async/await
    await new Promise((resolve, reject) => {
      db.query(que, [values], (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    // Fetch user info
    const user = await getUserInfo(req.body.created_by)

    // Define email parameters
    const to =
      req.body.created_by_user_type === 1
        ? 'neuroheadachecenter@gmail.com'
        : user.email // The user's email address
    const subject = req.body.subject
    const text = req.body.body
    const html = `<p>${req.body.body}</p>`

    // Send email
    try {
      await sendEmail(to, subject, text, html)
      res.status(200).json({ status: 200, msg: 'Email sent successfully' })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      res.status(500).json({ status: 500, msg: 'Error sending email' })
    }
  } catch (err) {
    console.error('Error saving enquiry:', err)
    res.status(500).json({ status: 500, msg: 'Internal server error' })
  }
}

export const getCommunicationListByProtocolId = (req, res) => {
  const protocolId = req.body.protocol_id // Get the protocol_id from the request body
  const status = req.body.status // Assuming you're looking for status = 2
  const que = `SELECT cm.*, GROUP_CONCAT(cd.file_url SEPARATOR ', ') AS attachments
    FROM communication AS cm
    JOIN communication_documents AS cd 
      ON FIND_IN_SET(cd.id, cm.attachments_id) > 0
    WHERE cm.protocol_id = ? 
      AND cm.status = ? 
      AND cm.attachments_id IS NOT NULL 
      AND cm.attachments_id != ''
    GROUP BY cm.id`

  // Execute the query using async/await
  db.query(que, [protocolId, status], (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Database query error', error: err })
    }

    if (data.length > 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json({ message: 'No data found' })
    }
  })
}
