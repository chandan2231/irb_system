import { db } from '../connect.js'
import sendEmail from '../emailService.js'
import { getUserInfo } from '../userData.js'

// Save Enquiry Request function
export const saveEnquiryRequest = async (req, res) => {
  try {
    const datetime = new Date()
    const attachmentString =
      req.body.attachments_file.length > 0
        ? req.body.attachments_file.join(',')
        : ''

    const que =
      'insert into communication (`protocol_id`, `attachments_id`, `protocol_type`, `subject`, `body`, `created_by_user_type`, `status`, `reply_thread_parent_id`, `created_by`,`created_at`,`updated_at`) values (?)'
    const values = [
      req.body.protocol_id,
      attachmentString,
      req.body.protocol_type,
      req.body.subject,
      req.body.body,
      req.body.created_by_user_type,
      req.body.status,
      req.body.reply_thread_parent_id,
      req.body.created_by,
      datetime.toISOString(),
      datetime.toISOString()
    ]

    // Wrap the db query in a promise to use async/await
    const result = await new Promise((resolve, reject) => {
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
    // Fetch attachment info
    const getAttachement = await handleCommunicationRequest(result.insertId)

    // Extract the URLs (if there are any)
    const attachmentUrls = getAttachement
      .map((item) => item.attachments)
      .join(',') // If it's an array of URLs, join them into a single string
      .split(',') // Split the string into an array by commas
      .map((url) => url.trim()) // Trim any leading/trailing whitespace from each URL
      .filter(Boolean) // Filter out any empty or invalid URLs

    // Build HTML for attachments (if any)
    let attachmentHtml = ''
    if (attachmentUrls.length > 0) {
      attachmentHtml = '<p>Attachments:</p><ul>'
      attachmentUrls.forEach((url, idx) => {
        attachmentHtml += `
          <li>
            <a href="${url}" target="_blank" rel="noopener noreferrer">
              Attachment ${idx + 1}
            </a>
          </li>
        `
      })
      attachmentHtml += '</ul>'
    }

    // Define email parameters
    const to =
      req.body.status === 2 ? user.email : 'neuroheadachecenter@gmail.com' // The user's email address
    const subject = req.body.subject

    // Create protocol and body HTML
    var protocolNumberHtml = `<p>Protocol Number:${req.body.protocol_id}</p>`
    var bodyHtml = `<p>${req.body.body}</p>`

    // Create attachment HTML if there are attachments

    // Combine all email content into one HTML
    const emailHtml = `
  <div>
    ${protocolNumberHtml}
    ${bodyHtml}
    ${attachmentHtml}
  </div>
`
    const text = emailHtml
    const html = emailHtml

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

// Get Communication List by Protocol ID
export const getCommunicationListByProtocolId = async (req, res) => {
  const protocolId = req.body.protocol_id
  const status = req.body.status
  const que = `SELECT cm.*, 
       GROUP_CONCAT(cd.file_url SEPARATOR ', ') AS attachments
FROM communication AS cm
LEFT JOIN communication_documents AS cd 
    ON FIND_IN_SET(cd.id, cm.attachments_id) > 0
WHERE cm.protocol_id = ? 
  AND cm.status = ? 
  AND (cm.attachments_id IS NOT NULL AND cm.attachments_id != '' OR cm.attachments_id IS NULL OR cm.attachments_id = '')
GROUP BY cm.id`

  try {
    // Execute the query using async/await
    const data = await new Promise((resolve, reject) => {
      db.query(que, [protocolId, status], (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    if (data.length > 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json({ message: 'No data found' })
    }
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ message: 'Database query error', error: err })
  }
}

// New function to handle the request for communication list
export const handleCommunicationRequest = (id) => {
  return new Promise((resolve, reject) => {
    // Create a mock req and res object for the call
    const req = {
      body: {
        id: id
      }
    }

    // Mock response object
    const res = {
      status: (statusCode) => {
        return {
          json: (data) => {
            if (statusCode === 200) {
              resolve(data) // Resolve the promise with the data
            } else {
              reject(data) // Reject the promise with an error message
            }
          }
        }
      }
    }

    // Call the original function
    getCommunicationDetailsById(req, res)
  })
}

// Get Communication List by Protocol ID
export const getCommunicationDetailsById = async (req, res) => {
  const id = req.body.id
  const que = `SELECT cm.*, 
       GROUP_CONCAT(cd.file_url SEPARATOR ', ') AS attachments
FROM communication AS cm
LEFT JOIN communication_documents AS cd 
    ON FIND_IN_SET(cd.id, cm.attachments_id) > 0
WHERE cm.id = ? 
  AND (cm.attachments_id IS NOT NULL AND cm.attachments_id != '')
GROUP BY cm.id`

  try {
    // Execute the query using async/await
    const data = await new Promise((resolve, reject) => {
      db.query(que, [id], (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    if (data.length >= 0) {
      return res.status(200).json(data)
    } else {
      return res.status(404).json({ message: 'No data found' })
    }
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ message: 'Database query error', error: err })
  }
}
