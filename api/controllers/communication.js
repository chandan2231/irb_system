import { db } from '../connect.js'

export const saveEnquiryRequest = (req, res) => {
  // console.log('req.body', req.body)
  // return
  var datetime = new Date()
  const attachmentString = req.body.attachments_file
    ? req.body.attachments_file.join(',')
    : ''
  const que =
    'insert into communication (`protocol_id`, `attachments_id`, `protocol_type`, `subject`, `body`, `created_by_user_type`, `status`, `created_by`,`created_at`,`updated_at`) value (?)'
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
  db.query(que, [values], (err, data) => {
    if (err) {
      let result = {}
      result.status = 500
      result.msg = err
      return res.json(result)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Email sent successfully'
      return res.json(result)
    }
  })
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

  // Execute the query
  db.query(que, [protocolId, status], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    }

    if (data.length >= 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json({ message: 'No data found' })
    }
  })
}
