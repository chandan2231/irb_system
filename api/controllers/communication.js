import { db } from '../connect.js'

export const saveEnquiryRequest = (req, res) => {
  //   console.log('req.body', req.body)
  //   return
  var datetime = new Date()
  const que =
    'insert into communication (`protocol_id`, `protocol_type`, `subject`, `body`, `created_by_user_type`, `status`, `created_by`,`created_at`,`updated_at`) value (?)'
  const values = [
    req.body.protocol_id,
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
      result.msg = 'Enquery has been saved successfully'
      return res.json(result)
    }
  })
}
