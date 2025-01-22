import { db } from '../connect.js'
import fs from 'fs'
import { generatePdfFromHTML } from '../utils/pdfService.js'
import * as s3Service from '../utils/s3Service.js'
import PdfTemplates from '../templates/generate-pdf.js'
import sendEmail from '../emailService.js'
import { getUserInfo } from '../userData.js'

export const multiSiteChildProtocolsList = (req, res) => {
  const que = `SELECT 
      ps.protocol_id, 
      ps.parent_protocol_id, 
      users.name, 
      users.mobile, 
      users.email
    FROM 
      protocols AS ps
    LEFT JOIN 
      users ON ps.added_by = users.id
    WHERE 
      ps.parent_protocol_id = ?`
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const checkMultisiteProtocolExist = (req, res) => {
  const que =
    'SELECT * FROM protocols WHERE protocol_id = ? AND varification_code = ?'
  db.query(
    que,
    [req.body.protocolId, req.body.verificationCode],
    (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err })
      }

      if (data.length > 0) {
        const updateQuery = `
        UPDATE protocols 
        SET added_by = ? 
        WHERE protocol_id = ? AND varification_code = ?
      `
        const updateValues = [
          req.body.loggedinUserId,
          req.body.protocolId,
          req.body.verificationCode
        ]

        db.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: 'Failed to update protocol', error: err })
          }

          return res
            .status(200)
            .json({ message: 'Protocol Verified successfully' })
        })
      } else {
        return res.status(404).json({
          message:
            'Entered protocol id and verification code not matched. Please check your input and try again.'
        })
      }
    }
  )
}

export const createProtocol = async (req, res) => {
  try {
    const prefix = 'IRBH'
    const que1 = 'SELECT protocol_id FROM protocols ORDER BY id DESC LIMIT 1'
    const result = await new Promise((resolve, reject) => {
      db.query(que1, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    const data = Array.isArray(result) ? result : [result]
    let newProtocolNumber
    if (data && data.length > 0) {
      const lastProtocolNumber = data[0].protocol_id
      const lastNumber = parseInt(lastProtocolNumber.replace(prefix, ''), 10) // Remove the prefix and convert to number
      const incrementedNumber = lastNumber + 1
      newProtocolNumber = prefix + incrementedNumber.toString().padStart(5, '0') // Ensure the number has leading zeros
    } else {
      newProtocolNumber = prefix + '00001'
    }

    const que2 =
      'INSERT INTO protocols (`protocol_id`, `research_type`, `added_by`) VALUES (?)'
    const protocolValue = [
      newProtocolNumber,
      req.body.research_type_id,
      req.body.login_id
    ]

    // Wrap the insert query in a promise to use async/await
    await new Promise((resolve, reject) => {
      db.query(que2, [protocolValue], (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    // Fetch user info
    const user = await getUserInfo(req.body.login_id)
    const to = user.email
    const subject = 'Protocol Created'

    // Create protocol and body HTML
    const grettingHtml = `<p>Dear ${user.name},</p>`
    const bodyHtml = `<p>You have successfully registered your research with us.</p>`
    const protocolNumberHtml = `<p>Your Protocol Number is ${newProtocolNumber}</p>`

    const emailHtml = `
      <div>
        ${grettingHtml}
        ${bodyHtml}
        ${protocolNumberHtml}
      </div>`
    const text = emailHtml
    const html = emailHtml

    // Send email
    try {
      await sendEmail(to, subject, text, html)

      const resultResponse = {
        status: 200,
        msg:
          'Research type has been created with protocol number: ' +
          newProtocolNumber
      }
      return res.json(resultResponse)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      res.status(500).json({ status: 500, msg: 'Error sending email' })
    }
  } catch (err) {
    console.error('Error in creating protocol:', err)
    return res.status(500).json({
      status: 500,
      msg: 'An error occurred while creating the protocol'
    })
  }
}

export const getProtocolList = (req, res) => {
  const que = 'select * from protocols where added_by = ?'
  db.query(que, [req.body.login_id], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getApprovedProtocolCheck = (req, res) => {
  const que = 'SELECT * from protocols WHERE added_by=? AND status=?'
  db.query(que, [req.body.userId, 3], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data.length)
    }
  })
}

export const getApprovedProtocolList = (req, res) => {
  const que = 'SELECT * from protocols WHERE added_by=? AND status=?'
  db.query(que, [req.body.login_id, 3], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

// export const createProtocol = (req, res) => {
//     // CHECK RESEARCH TYPE IF EXIST
//     const que = "select * from protocols where research_type = ? AND added_by = ?"
//     db.query(que, [req.body.research_type_id, req.body.login_id], (err, data) => {
//         if (err) return res.status(500).json(err)
//         if (data.length > 0) {
//             return res.status(400).json('You have already added the selected research type, try with other')
//         }
//         // CREATE A NEW Entry
//         const protocolNumber = "IRB" + Math.floor(Math.random() * 899999 + 100000);
//         const que2 = 'insert into protocols (`protocol_id`, `research_type`, `added_by`, `added_timestamp`, `updated_timestamp`) value (?)';
//         const protocolValue = [
//             protocolNumber,
//             req.body.research_type_id,
//             req.body.login_id,
//             new Date().getTime(),
//             new Date().getTime(),
//         ]
//         db.query(que2, [protocolValue], (err2, data) => {
//             if (err2) return res.status(500).json(err2)
//             return res.status(200).json('Research type has been created.')
//         })
//     })

// }

export const saveFile = async (req, res) => {
  var datetime = new Date()
  try {
    if (req.file) {
      let sRL = await s3Service.uploadFile(req.file.path)
      let imageUrl = sRL.cdnUrl
      // Remove the file from the local server
      fs.unlinkSync(req.file.path)
      if (req.body.protocolType === 'continuein_review') {
        const que2 =
          'insert into continuein_review_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)'
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10)
        ]
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err)
          if (data) {
            return res.status(200).json({ id: data.insertId })
          }
        })
      } else if (req.body.protocolType === 'Protocol Amendment Request') {
        const que2 =
          'insert into protocol_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)'
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10)
        ]
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err)
          if (data) {
            return res.status(200).json({ id: data.insertId })
          }
        })
      } else if (req.body.informationType === 'communication_attachments') {
        const que2 =
          'insert into communication_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by_user_type`, `created_by`, `created_at`, `updated_at`) value (?)'
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdByUserType,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10)
        ]
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err)
          if (data) {
            return res.status(200).json({ id: data.insertId })
          }
        })
      } else {
        const que2 =
          'insert into protocol_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)'
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10)
        ]
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err)
          if (data) {
            return res.status(200).json({ id: data.insertId })
          }
        })
      }
    } else {
      return res.status(400).json({ message: 'No file uploaded' })
    }
  } catch (error) {
    console.log({ error })
    fs.unlinkSync(req.file?.path)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const continueinReviewGeneratePdf = async (req, res) => {
  const continuinReviewDetailObj = {}
  const que = 'select * from risk_assessment where protocol_id = ?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (data.length >= 0) {
      continuinReviewDetailObj.risk_assessment = data[0] || {}
      const docQue =
        'select * from continuein_review_documents where protocol_id = ? AND information_type = ?'
      db.query(
        docQue,
        [req.body.protocolId, 'risk_assessment'],
        (err, data) => {
          if (data.length >= 0) {
            continuinReviewDetailObj.risk_assessment.documents = data || {}
          } else {
            continuinReviewDetailObj.risk_assessment.documents = []
          }
        }
      )
      const que2 =
        'select * from informed_consent_process where protocol_id = ?'
      db.query(que2, [req.body.protocolId], (err, data) => {
        if (data.length >= 0) {
          continuinReviewDetailObj.informed_consent_process = data[0] || {}
          const docQue =
            'select * from continuein_review_documents where protocol_id = ? AND information_type = ?'
          db.query(
            docQue,
            [req.body.protocolId, 'informed_consent_process'],
            (err, data) => {
              if (data.length >= 0) {
                continuinReviewDetailObj.informed_consent_process.documents =
                  data || {}
              } else {
                continuinReviewDetailObj.informed_consent_process.documents = []
              }
            }
          )
          const que3 =
            'select * from investigator_instuation_info where protocol_id = ?'
          db.query(que3, [req.body.protocolId], (err, data) => {
            if (data.length >= 0) {
              continuinReviewDetailObj.investigator_instuation_info =
                data[0] || {}
              const docQue =
                'select * from continuein_review_documents where protocol_id = ? AND information_type = ?'
              db.query(
                docQue,
                [req.body.protocolId, 'investigator_and_institution'],
                (err, data) => {
                  if (data.length >= 0) {
                    continuinReviewDetailObj.investigator_instuation_info.documents =
                      data || {}
                  } else {
                    continuinReviewDetailObj.investigator_instuation_info.documents =
                      []
                  }
                }
              )
              const que4 =
                'select * from research_progress_info where protocol_id = ?'
              db.query(que4, [req.body.protocolId], (err, data) => {
                if (data.length >= 0) {
                  continuinReviewDetailObj.research_progress_info =
                    data[0] || {}
                  const docQue =
                    'select * from continuein_review_documents where protocol_id = ? AND information_type = ?'
                  db.query(
                    docQue,
                    [req.body.protocolId, 'research_progress'],
                    async (err, data) => {
                      if (data.length >= 0) {
                        continuinReviewDetailObj.research_progress_info.documents =
                          data || {}
                      } else {
                        continuinReviewDetailObj.research_progress_info.documents =
                          []
                      }

                      try {
                        const protocolId = req.body
                        const template =
                          await PdfTemplates.ContinuingReviewPdfTemplate(
                            continuinReviewDetailObj,
                            protocolId
                          )
                        let filePath = await generatePdfFromHTML(template)
                        console.log('filePath', filePath)
                        let sRL = await s3Service.uploadFile(filePath)
                        console.log('sRL', sRL)
                        let pdfUrl = sRL.cdnUrl
                        // Remove the file from the local server
                        fs.unlinkSync(filePath)
                        return res.status(200).json({ pdfUrl })
                      } catch (error) {
                        console.log(error)
                        return res
                          .status(500)
                          .json({ message: 'Internal Server Error' })
                      }
                    }
                  )
                }
              })
            }
          })
        }
      })
    }
  })
  return
}

// export const protocolGeneratePdf = async (req, res) => {
//   const protocolDetailsObj = {}
//   if (req.body.protocolType === 'Clinical Site') {
//     const que1 = 'select * from protocol_information where protocol_id = ?'
//     db.query(que1, [req.body.protocolId], (err, data) => {
//       if (data.length >= 0) {
//         protocolDetailsObj.protocol_information = data[0] || {}
//         const docQue =
//           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//         db.query(
//           docQue,
//           [req.body.protocolId, 'protocol_information'],
//           async (err, data) => {
//             if (data.length >= 0) {
//               protocolDetailsObj.protocol_information.documents = data || {}
//             } else {
//               protocolDetailsObj.protocol_information.documents = []
//             }
//           }
//         )
//         const que2 =
//           'select * from investigator_information where protocol_id = ?'
//         db.query(que2, [req.body.protocolId], (err, data) => {
//           if (data.length >= 0) {
//             protocolDetailsObj.investigator_information = data[0] || {}
//             const docQue =
//               'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//             db.query(
//               docQue,
//               [req.body.protocolId, 'investigator_information'],
//               async (err, data) => {
//                 if (data.length >= 0) {
//                   protocolDetailsObj.investigator_information.documents =
//                     data || {}
//                 } else {
//                   protocolDetailsObj.investigator_information.documents = []
//                 }
//               }
//             )
//             const que3 = 'select * from study_information where protocol_id = ?'
//             db.query(que3, [req.body.protocolId], (err, data) => {
//               if (data.length >= 0) {
//                 protocolDetailsObj.study_information = data[0] || {}
//                 const docQue =
//                   'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                 db.query(
//                   docQue,
//                   [req.body.protocolId, 'study_information'],
//                   async (err, data) => {
//                     if (data.length >= 0) {
//                       protocolDetailsObj.study_information.documents =
//                         data || {}
//                     } else {
//                       protocolDetailsObj.study_information.documents = []
//                     }
//                   }
//                 )
//                 const que4 =
//                   'select * from informed_consent where protocol_id = ?'
//                 db.query(que4, [req.body.protocolId], (err, data) => {
//                   if (data.length >= 0) {
//                     protocolDetailsObj.informed_consent = data[0] || {}
//                     const docQue =
//                       'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                     db.query(
//                       docQue,
//                       [req.body.protocolId, 'informed_consent'],
//                       async (err, data) => {
//                         if (data.length >= 0) {
//                           protocolDetailsObj.informed_consent.documents = data
//                         } else {
//                           protocolDetailsObj.informed_consent.documents = []
//                         }
//                       }
//                     )
//                     const que5 =
//                       'select * from protocol_procedure where protocol_id = ?'
//                     db.query(que5, [req.body.protocolId], (err, data) => {
//                       if (data.length >= 0) {
//                         protocolDetailsObj.protocol_procedure = data[0] || {}
//                         const docQue =
//                           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                         db.query(
//                           docQue,
//                           [req.body.protocolId, 'protocol_procedure'],
//                           async (err, data) => {
//                             if (data.length >= 0) {
//                               protocolDetailsObj.protocol_procedure.documents =
//                                 data
//                             } else {
//                               protocolDetailsObj.protocol_procedure.documents =
//                                 []
//                             }
//                             try {
//                               const protocolId = req.body
//                               const template =
//                                 await PdfTemplates.protocolAmendmentRequestPdfTemplate.ClinicalSitePdfTemplate(
//                                   protocolDetailsObj,
//                                   protocolId
//                                 )
//                               let filePath = await generatePdfFromHTML(template)
//                               console.log('filePath', filePath)
//                               let sRL = await s3Service.uploadFile(filePath)
//                               console.log('sRL', sRL)
//                               let pdfUrl = sRL.cdnUrl
//                               // Remove the file from the local server
//                               fs.unlinkSync(filePath)
//                               return res.status(200).json({ pdfUrl })
//                             } catch (error) {
//                               console.log(error)
//                               return res
//                                 .status(500)
//                                 .json({ message: 'Internal Server Error' })
//                             }
//                           }
//                         )
//                       }
//                     })
//                   }
//                 })
//               }
//             })
//           }
//         })
//       }
//     })
//   } else if (req.body.protocolType === 'Multi-Site Sponsor') {
//     const que1 = 'select * from protocol_information where protocol_id = ?'
//     db.query(que1, [req.body.protocolId], (err, data) => {
//       if (data.length >= 0) {
//         protocolDetailsObj.protocol_information = data[0] || {}
//         const docQue =
//           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//         db.query(
//           docQue,
//           [req.body.protocolId, 'protocol_information'],
//           async (err, data) => {
//             if (data.length >= 0) {
//               protocolDetailsObj.protocol_information.documents = data
//             } else {
//               protocolDetailsObj.protocol_information.documents = []
//             }
//           }
//         )
//         const que2 = 'select * from contact_information where protocol_id = ?'
//         db.query(que2, [req.body.protocolId], (err, data) => {
//           if (data.length >= 0) {
//             protocolDetailsObj.contact_information = data[0] || {}
//             const docQue =
//               'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//             db.query(
//               docQue,
//               [req.body.protocolId, 'contact_information'],
//               async (err, data) => {
//                 if (data.length >= 0) {
//                   protocolDetailsObj.contact_information.documents = data
//                 } else {
//                   protocolDetailsObj.contact_information.documents = []
//                 }
//               }
//             )
//             const que3 = 'select * from study_information where protocol_id = ?'
//             db.query(que3, [req.body.protocolId], (err, data) => {
//               if (data.length >= 0) {
//                 protocolDetailsObj.study_information = data[0] || {}
//                 const docQue =
//                   'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                 db.query(
//                   docQue,
//                   [req.body.protocolId, 'study_information'],
//                   async (err, data) => {
//                     if (data.length >= 0) {
//                       protocolDetailsObj.study_information.documents = data
//                     } else {
//                       protocolDetailsObj.study_information.documents = []
//                     }
//                   }
//                 )
//                 const que4 =
//                   'select * from informed_consent where protocol_id = ?'
//                 db.query(que4, [req.body.protocolId], (err, data) => {
//                   if (data.length >= 0) {
//                     protocolDetailsObj.informed_consent = data[0] || {}
//                     const docQue =
//                       'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                     db.query(
//                       docQue,
//                       [req.body.protocolId, 'informed_consent'],
//                       async (err, data) => {
//                         if (data.length >= 0) {
//                           protocolDetailsObj.informed_consent.documents = data
//                         } else {
//                           protocolDetailsObj.informed_consent.documents = []
//                         }
//                       }
//                     )
//                     const que5 =
//                       'select * from protocol_procedure where protocol_id = ?'
//                     db.query(que5, [req.body.protocolId], (err, data) => {
//                       if (data.length >= 0) {
//                         protocolDetailsObj.protocol_procedure = data[0] || {}
//                         const docQue =
//                           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                         db.query(
//                           docQue,
//                           [req.body.protocolId, 'protocol_procedure'],
//                           async (err, data) => {
//                             if (data.length >= 0) {
//                               protocolDetailsObj.protocol_procedure.documents =
//                                 data
//                             } else {
//                               protocolDetailsObj.protocol_procedure.documents =
//                                 []
//                             }
//                             // return res.status(200).json(protocolDetailsObj);
//                             try {
//                               const protocolId = req.body
//                               const template =
//                                 await PdfTemplates.protocolAmendmentRequestPdfTemplate.MultiSiteSponsorPdfTemplate(
//                                   protocolDetailsObj,
//                                   protocolId
//                                 )
//                               let filePath = await generatePdfFromHTML(template)
//                               console.log('filePath', filePath)
//                               let sRL = await s3Service.uploadFile(filePath)
//                               console.log('sRL', sRL)
//                               let pdfUrl = sRL.cdnUrl
//                               // Remove the file from the local server
//                               fs.unlinkSync(filePath)
//                               return res.status(200).json({ pdfUrl })
//                             } catch (error) {
//                               console.log(error)
//                               return res
//                                 .status(500)
//                                 .json({ message: 'Internal Server Error' })
//                             }
//                           }
//                         )
//                       }
//                     })
//                   }
//                 })
//               }
//             })
//           }
//         })
//       }
//     })
//   } else if (req.body.protocolType === 'Document Review') {
//     const que1 = 'select * from protocol_information where protocol_id = ?'
//     db.query(que1, [req.body.protocolId], (err, data) => {
//       if (data.length >= 0) {
//         protocolDetailsObj.protocol_information = data[0] || {}
//         const docQue =
//           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//         db.query(
//           docQue,
//           [req.body.protocolId, 'protocol_information'],
//           async (err, data) => {
//             if (data.length >= 0) {
//               protocolDetailsObj.protocol_information.documents = data
//             } else {
//               protocolDetailsObj.protocol_information.documents = []
//             }
//           }
//         )
//         const que2 =
//           'select * from investigator_information where protocol_id = ?'
//         db.query(que2, [req.body.protocolId], (err, data) => {
//           if (data.length >= 0) {
//             protocolDetailsObj.investigator_information = data[0] || {}
//             const docQue =
//               'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//             db.query(
//               docQue,
//               [req.body.protocolId, 'investigator_information'],
//               async (err, data) => {
//                 if (data.length >= 0) {
//                   protocolDetailsObj.investigator_information.documents = data
//                 } else {
//                   protocolDetailsObj.investigator_information.documents = []
//                 }
//               }
//             )
//             const que3 = 'select * from informed_consent where protocol_id = ?'
//             db.query(que3, [req.body.protocolId], (err, data) => {
//               if (data.length >= 0) {
//                 protocolDetailsObj.informed_consent = data[0] || {}
//                 const docQue =
//                   'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//                 db.query(
//                   docQue,
//                   [req.body.protocolId, 'informed_consent'],
//                   async (err, data) => {
//                     if (data.length >= 0) {
//                       protocolDetailsObj.informed_consent.documents = data
//                     } else {
//                       protocolDetailsObj.informed_consent.documents = []
//                     }
//                     try {
//                       const protocolId = req.body
//                       const template =
//                         await PdfTemplates.protocolAmendmentRequestPdfTemplate.PrincipalInvestigatorPdfTemplate(
//                           protocolDetailsObj,
//                           protocolId
//                         )
//                       let filePath = await generatePdfFromHTML(template)
//                       console.log('filePath', filePath)
//                       let sRL = await s3Service.uploadFile(filePath)
//                       console.log('sRL', sRL)
//                       let pdfUrl = sRL.cdnUrl
//                       // Remove the file from the local server
//                       fs.unlinkSync(filePath)
//                       return res.status(200).json({ pdfUrl })
//                     } catch (error) {
//                       console.log(error)
//                       return res
//                         .status(500)
//                         .json({ message: 'Internal Server Error' })
//                     }
//                   }
//                 )
//               }
//             })
//           }
//         })
//       }
//     })
//   } else {
//     const que1 =
//       'select * from investigator_protocol_information where protocol_id = ?'
//     db.query(que1, [req.body.protocolId], (err, data) => {
//       if (data.length >= 0) {
//         protocolDetailsObj.investigator_protocol_information = data[0] || {}
//         const docQue =
//           'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//         db.query(
//           docQue,
//           [req.body.protocolId, 'investigator_protocol_information'],
//           async (err, data) => {
//             if (data.length >= 0) {
//               protocolDetailsObj.investigator_protocol_information.documents =
//                 data
//             } else {
//               protocolDetailsObj.investigator_protocol_information.documents =
//                 []
//             }
//           }
//         )
//         const que2 =
//           'select * from clinical_consent_information where protocol_id = ?'
//         db.query(que2, [req.body.protocolId], (err, data) => {
//           if (data.length >= 0) {
//             protocolDetailsObj.consent_information = data[0] || {}
//             const docQue =
//               'select * from protocol_documents where protocol_id = ? AND information_type = ?'
//             db.query(
//               docQue,
//               [req.body.protocolId, 'consent_information'],
//               async (err, data) => {
//                 if (data.length >= 0) {
//                   protocolDetailsObj.consent_information.documents = data
//                 } else {
//                   protocolDetailsObj.consent_information.documents = []
//                 }
//                 // return res.status(200).json(protocolDetailsObj);
//                 try {
//                   const protocolId = req.body
//                   const template =
//                     await PdfTemplates.protocolAmendmentRequestPdfTemplate.PrincipalInvestigatorPdfTemplate(
//                       protocolDetailsObj,
//                       protocolId
//                     )
//                   let filePath = await generatePdfFromHTML(template)
//                   console.log('filePath', filePath)
//                   let sRL = await s3Service.uploadFile(filePath)
//                   console.log('sRL', sRL)
//                   let pdfUrl = sRL.cdnUrl
//                   // Remove the file from the local server
//                   fs.unlinkSync(filePath)
//                   return res.status(200).json({ pdfUrl })
//                 } catch (error) {
//                   console.log(error)
//                   return res
//                     .status(500)
//                     .json({ message: 'Internal Server Error' })
//                 }
//               }
//             )
//           }
//         })
//       }
//     })
//   }
// }

const getProtocolDocuments = async (protocolId, informationType) => {
  const query =
    'select * from protocol_documents where protocol_id = ? AND information_type = ?'
  return new Promise((resolve, reject) => {
    db.query(query, [protocolId, informationType], (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.length > 0 ? data : [])
      }
    })
  })
}

const getProtocolDetails = async (protocolId, protocolType) => {
  const protocolDetailsObj = {}

  const queries = {
    'Clinical Site': [
      {
        key: 'protocol_information',
        query: 'select * from protocol_information where protocol_id = ?'
      },
      {
        key: 'investigator_information',
        query: 'select * from investigator_information where protocol_id = ?'
      },
      {
        key: 'study_information',
        query: 'select * from study_information where protocol_id = ?'
      },
      {
        key: 'informed_consent',
        query: 'select * from informed_consent where protocol_id = ?'
      },
      {
        key: 'protocol_procedure',
        query: 'select * from protocol_procedure where protocol_id = ?'
      }
    ],
    'Multi-Site Sponsor': [
      {
        key: 'protocol_information',
        query: 'select * from protocol_information where protocol_id = ?'
      },
      {
        key: 'contact_information',
        query: 'select * from contact_information where protocol_id = ?'
      },
      {
        key: 'study_information',
        query: 'select * from study_information where protocol_id = ?'
      },
      {
        key: 'informed_consent',
        query: 'select * from informed_consent where protocol_id = ?'
      },
      {
        key: 'protocol_procedure',
        query: 'select * from protocol_procedure where protocol_id = ?'
      }
    ],
    'Document Review': [
      {
        key: 'protocol_information',
        query: 'select * from protocol_information where protocol_id = ?'
      },
      {
        key: 'investigator_information',
        query: 'select * from investigator_information where protocol_id = ?'
      },
      {
        key: 'informed_consent',
        query: 'select * from informed_consent where protocol_id = ?'
      }
    ],
    default: [
      {
        key: 'investigator_protocol_information',
        query:
          'select * from investigator_protocol_information where protocol_id = ?'
      },
      {
        key: 'consent_information',
        query:
          'select * from clinical_consent_information where protocol_id = ?'
      }
    ]
  }

  const selectedQueries = queries[protocolType] || queries['default']

  try {
    // Fetch all details for the protocol
    for (const { key, query } of selectedQueries) {
      const data = await new Promise((resolve, reject) => {
        db.query(query, [protocolId], (err, data) => {
          if (err) reject(err)
          else resolve(data.length > 0 ? data[0] : {})
        })
      })
      protocolDetailsObj[key] = data

      // Fetch associated documents for each key
      const documents = await getProtocolDocuments(protocolId, key)
      protocolDetailsObj[key].documents = documents
    }
    return protocolDetailsObj
  } catch (error) {
    throw new Error(`Error fetching protocol details: ${error.message}`)
  }
}

export const protocolGeneratePdf = async (req, res) => {
  const { protocolId, protocolType } = req.body

  try {
    // Fetch protocol details
    const protocolDetailsObj = await getProtocolDetails(
      protocolId,
      protocolType
    )

    // Generate PDF
    let template
    if (protocolType === 'Clinical Site') {
      template =
        await PdfTemplates.protocolAmendmentRequestPdfTemplate.ClinicalSitePdfTemplate(
          protocolDetailsObj,
          req.body
        )
    } else if (protocolType === 'Multi-Site Sponsor') {
      template =
        await PdfTemplates.protocolAmendmentRequestPdfTemplate.MultiSiteSponsorPdfTemplate(
          protocolDetailsObj,
          req.body
        )
    } else if (protocolType === 'Document Review') {
      template =
        await PdfTemplates.protocolAmendmentRequestPdfTemplate.DocumentReviewPdfTemplate(
          protocolDetailsObj,
          req.body
        )
    } else {
      template =
        await PdfTemplates.protocolAmendmentRequestPdfTemplate.PrincipalInvestigatorPdfTemplate(
          protocolDetailsObj,
          req.body
        )
    }

    // Generate the PDF from template HTML
    const filePath = await generatePdfFromHTML(template)
    console.log('filePath', filePath)

    // Upload the PDF to S3
    const sRL = await s3Service.uploadFile(filePath)
    console.log('sRL', sRL)
    const pdfUrl = sRL.cdnUrl

    // Remove the file from the local server
    fs.unlinkSync(filePath)

    // Respond with the generated PDF URL
    return res.status(200).json({ pdfUrl })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
