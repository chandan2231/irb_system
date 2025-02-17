import { db } from '../connect.js'
import bcrypt from 'bcryptjs'
import sendEmail from '../emailService.js'
import { getUserInfo, getUserInfoByProtocolId } from '../userData.js'
import { v4 as uuidv4 } from 'uuid'

export const getMasterDataListByType = (req, res) => {
  const { selectedUserType } = req.body

  let query = ''
  let queryParams = []

  switch (selectedUserType) {
    case 'Clinical Researcher Coordinator':
      query = 'SELECT * FROM clinical_research_coordinator'
      break

    case 'Clinical Trial Monitor':
      query = 'SELECT * FROM users WHERE researcher_type = ?'
      queryParams = ['External Monitor']
      break

    case 'Principle Investigator':
    case 'Principle Sub Investigator':
      const investigatorQueries = [
        'SELECT id, investigator_name AS name, investigator_email AS email FROM investigator_protocol_information',
        'SELECT id, investigator_name AS name, investigator_email AS email FROM investigator_information'
      ]

      return Promise.all(
        investigatorQueries.map(
          (q) =>
            new Promise((resolve, reject) => {
              db.query(q, [], (err, data) => {
                if (err) return reject(err)
                resolve(data)
              })
            })
        )
      )
        .then((results) => {
          const combinedResults = results.flat() // Merge both query results
          return res.status(200).json(combinedResults)
        })
        .catch((err) => res.status(500).json({ error: err.message }))

    default:
      return res.status(400).json({ error: 'Invalid user type' })
  }

  db.query(query, queryParams, (err, data) => {
    if (err) return res.status(500).json({ error: err.message })
    return res.status(200).json(data)
  })
}

export const chairCommitteeApprovalProtocol = async (req, res) => {
  try {
    const datetime = new Date()
    // Determine the protocol status based on the input
    let protocolStatus =
      req.body.protocol === 'Approved'
        ? 3
        : req.body.protocol === 'Under Review'
          ? 2
          : req.body.protocol === 'Rejected'
            ? 4
            : 5

    const que =
      'UPDATE protocols SET status=?, comment=?, electronic_signature=?, approval_date_by_chair_committee=? WHERE protocol_id=?'

    // Use a promise to handle the query and await its result
    const result = await new Promise((resolve, reject) => {
      db.query(
        que,
        [
          protocolStatus,
          req.body.comment,
          req.body.electronic_signature,
          datetime.toISOString().slice(0, 10),
          req.body.protocol_id
        ],
        (err, data) => {
          if (err) reject(err)
          resolve(data)
        }
      )
    })

    // Check if any rows were affected (ensure the protocol exists)
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 404, msg: 'Protocol not found' })
    }

    // Get user info and send email
    const userDetails = await getUserInfoByProtocolId(req.body.protocol_id)
    const user = await getUserInfo(userDetails.added_by)
    const to = user.email
    const subject = `Protocol Status of ${req.body.protocol_id}`

    // Create the greeting and body HTML for the email
    const greetingHtml = `<p>Dear ${user.name},</p>`
    const bodyHtml = `<p>Your protocol status for protocol id ${req.body.protocol_id} is: ${req.body.protocol}</p>`

    let additionalComment = ''
    if (req.body.comment && req.body.comment !== '') {
      additionalComment += `<p>Comment by the committee chair member:</p>`
      additionalComment += `<p>${req.body.comment}</p>` // Display the comment
    }

    const emailHtml = `
      <div>
        ${greetingHtml}
        ${bodyHtml}
        ${additionalComment}
      </div>`

    const text = emailHtml
    const html = emailHtml

    // Send the email
    try {
      await sendEmail(to, subject, text, html)

      // Respond to the client that the protocol was updated successfully
      const resultResponse = {
        status: 200,
        msg: 'Protocol status updated successfully'
      }
      return res.json(resultResponse)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return res.status(500).json({ status: 500, msg: 'Error sending email' })
    }
  } catch (err) {
    console.error('Error updating protocol:', err)
    return res.status(500).json({ status: 500, msg: 'Error updating protocol' })
  }
}

export const createMember = async (req, res) => {
  try {
    // Check if the email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?'
    const existingUserData = await new Promise((resolve, reject) => {
      db.query(checkEmailQuery, [req.body.email], (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    const existingUser = Array.isArray(existingUserData)
      ? existingUserData
      : [existingUserData]
    // If email exists, return an error
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json('Email already exists. Please try with another email.')
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    const verificationToken = uuidv4()

    // Insert new user into the database
    const insertQuery = `
      INSERT INTO users (name, mobile, email, password, researcher_type, user_type, verified, verification_token) 
      VALUES (?)`
    const values = [
      req.body.name,
      req.body.phone,
      req.body.email,
      hashedPassword,
      'member',
      req.body.user_type,
      0,
      verificationToken
    ]

    const insertResult = await new Promise((resolve, reject) => {
      db.query(insertQuery, [values], (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
    // Now, send the welcome email
    const loginUrl = `${process.env.DOMAIN}signin`
    const verifyLink = `${process.env.DOMAIN}verify-email/${verificationToken}`

    const to = req.body.email
    const subject = 'Welcome to IRBHUB'
    const greetingHtml = `<p>Dear ${req.body.name},</p>`
    let bodyHtml = `<p>You have successfully registered with IRBHUB as a ${req.body.user_type} role.</p>`
    bodyHtml += `<p>Your login details are</p>`
    bodyHtml += `<p>Email: ${req.body.email}</p>`
    bodyHtml += `<p>Password: ${req.body.password}</p>`
    bodyHtml += `<p>Login URL: <a href="${loginUrl}" target="_blank" rel="noopener noreferrer">
              Click here
            </a></p>`
    bodyHtml += `<h4>Click the link below to verify your email before login</h4><a href="${verifyLink}">Verify Email</a>`
    const emailHtml = `
      <div>
        ${greetingHtml}
        ${bodyHtml}
      </div>`
    const text = emailHtml
    const html = emailHtml

    // Send email
    try {
      await sendEmail(to, subject, text, html)
      return res
        .status(200)
        .json('Member has been created successfully and email sent.')
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return res
        .status(500)
        .json({ status: 500, msg: 'Member created but failed to send email.' })
    }
  } catch (err) {
    console.error('Error during registration:', err)
    return res.status(500).json({ status: 500, msg: 'Internal server error.' })
  }
}

export const getActiveVotingMemberList = (req, res) => {
  const que = 'select * from users WHERE user_type=? AND status=?'
  db.query(que, ['Voting Member', 1], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const changeEventPriceStatus = (req, res) => {
  const que = 'UPDATE event_price SET status=? WHERE id=?'
  db.query(que, [req.body.status, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Event Price Status Changed Successfully'
      return res.json(result)
    }
  })
}

export const createEventPrice = (req, res) => {
  const que = 'insert into event_price (`event_type`, `price`) value (?)'
  const values = [req.body.event_type, req.body.price]
  db.query(que, [values], (err, data) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json('Event Price has been created Successfully.')
  })
}

export const getEventPriceList = (req, res) => {
  const que = 'select * from event_price'
  db.query(que, [], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const changeUserPassword = (req, res) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)
  const que = 'UPDATE users SET password=? WHERE id=?'
  db.query(que, [hashedPassword, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      return res.status(200).json('User Password Reset Successfully')
    }
  })
}

export const changeMemberPassword = (req, res) => {
  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(req.body.password, salt)
  const que = 'UPDATE users SET password=? WHERE id=?'
  db.query(que, [hashedPassword, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      return res.status(200).json('Member Password Reset Successfully')
    }
  })
}

export const changeUserStatus = (req, res) => {
  const que = 'UPDATE users SET status=? WHERE id=?'
  db.query(que, [req.body.status, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'User Status Changed Successfully'
      result.id = req.body.id
      result.status = req.body.status
      return res.json(result)
    }
  })
}

export const changeMemberStatus = (req, res) => {
  const que = 'UPDATE users SET status=? WHERE id=?'
  db.query(que, [req.body.status, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Member Status Changed Successfully'
      result.id = req.body.id
      result.status = req.body.status
      return res.json(result)
    }
  })
}

export const getMemberList = (req, res) => {
  const que = 'select * from users where researcher_type=?'
  db.query(que, ['member'], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const allowProtocolEdit = (req, res) => {
  const que = 'UPDATE protocols SET allow_edit=? WHERE id=?'
  db.query(que, [req.body.allow_edit, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Protocol Edit Status Changed Successfully'
      result.id = req.body.id
      result.allow_edit = req.body.allow_edit
      return res.json(result)
    }
  })
}

export const allowProtocolWaiveFee = (req, res) => {
  const que = 'UPDATE protocols SET waive_fee=? WHERE id=?'
  db.query(que, [req.body.waive_fee, req.body.id], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Protocol Fee Waive Status Changed Successfully'
      result.id = req.body.id
      result.waive_fee = req.body.waive_fee
      return res.json(result)
    }
  })
}

// export const getApprovedProtocolList = (req, res) => {
//   const que =
//     'SELECT ps.*, users.name, users.mobile, users.email FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=3'
//   db.query(que, {}, (err, data) => {
//     if (err) return res.status(500).json(err)
//     if (data.length >= 0) {
//       return res.status(200).json(data)
//     }
//   })
// }

// export const getUnderReviewProtocolList = (req, res) => {
//   const que =
//     'SELECT ps.*, users.name, users.mobile, users.email FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=2'
//   db.query(que, {}, (err, data) => {
//     if (err) return res.status(500).json(err)
//     if (data.length >= 0) {
//       return res.status(200).json(data)
//     }
//   })
// }

// export const getRejectedProtocolList = (req, res) => {
//   const que =
//     'SELECT ps.*, users.name, users.mobile, users.email FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=4'
//   db.query(que, {}, (err, data) => {
//     if (err) return res.status(500).json(err)
//     if (data.length >= 0) {
//       return res.status(200).json(data)
//     }
//   })
// }

export const getApprovedProtocolList = (req, res) => {
  const page = parseInt(req.body.page) || 0
  const pageSize = parseInt(req.body.pageSize) || 10
  const offset = page * pageSize

  const countQuery = `SELECT COUNT(*) AS total FROM protocols WHERE status = 3`
  const dataQuery = `
    SELECT ps.*, users.name, users.mobile, users.email, users.city 
    FROM protocols AS ps 
    JOIN users ON ps.added_by = users.id 
    WHERE ps.status=3
    ORDER BY ps.id DESC 
    LIMIT ? OFFSET ?
  `

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message })

    const totalRecords = countResult[0].total
    const totalPages = Math.ceil(totalRecords / pageSize)

    db.query(dataQuery, [pageSize, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message })

      return res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          pageSize
        }
      })
    })
  })
}

export const getUnderReviewProtocolList = (req, res) => {
  const page = parseInt(req.body.page) || 0
  const pageSize = parseInt(req.body.pageSize) || 10
  const offset = page * pageSize

  const countQuery = `SELECT COUNT(*) AS total FROM protocols WHERE status = 2 AND added_by !=  0`
  const dataQuery = `
    SELECT ps.*, users.name, users.mobile, users.email, users.city 
    FROM protocols AS ps 
    JOIN users ON ps.added_by = users.id 
    WHERE ps.status=2
    ORDER BY ps.id DESC 
    LIMIT ? OFFSET ?
  `

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message })

    const totalRecords = countResult[0].total
    const totalPages = Math.ceil(totalRecords / pageSize)

    db.query(dataQuery, [pageSize, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message })

      return res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          pageSize
        }
      })
    })
  })
}

export const getRejectedProtocolList = (req, res) => {
  const page = parseInt(req.body.page) || 0
  const pageSize = parseInt(req.body.pageSize) || 10
  const offset = page * pageSize

  const countQuery = `SELECT COUNT(*) AS total FROM protocols WHERE status = 4`
  const dataQuery = `
    SELECT ps.*, users.name, users.mobile, users.email, users.city 
    FROM protocols AS ps 
    JOIN users ON ps.added_by = users.id 
    WHERE ps.status=4 
    ORDER BY ps.id DESC 
    LIMIT ? OFFSET ?
  `

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message })

    const totalRecords = countResult[0].total
    const totalPages = Math.ceil(totalRecords / pageSize)

    db.query(dataQuery, [pageSize, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message })

      return res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          pageSize
        }
      })
    })
  })
}

export const getCreatedProtocolList = (req, res) => {
  const page = parseInt(req.body.page) || 0
  const pageSize = parseInt(req.body.pageSize) || 10
  const offset = page * pageSize

  const countQuery = `SELECT COUNT(*) AS total FROM protocols WHERE status = 1`
  const dataQuery = `
    SELECT ps.*, users.name, users.mobile, users.email, users.city 
    FROM protocols AS ps 
    JOIN users ON ps.added_by = users.id 
    WHERE ps.status = 1 
    ORDER BY ps.id DESC 
    LIMIT ? OFFSET ?
  `

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message })

    const totalRecords = countResult[0].total
    const totalPages = Math.ceil(totalRecords / pageSize)

    db.query(dataQuery, [pageSize, offset], (err, data) => {
      if (err) return res.status(500).json({ error: err.message })

      return res.status(200).json({
        data,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          pageSize
        }
      })
    })
  })
}

export const getAllUsers = (req, res) => {
  const que =
    'select * from users where researcher_type != ? AND researcher_type!=?'
  db.query(que, ['admin', 'member'], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getContinuinDetailsById = (req, res) => {
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
                    (err, data) => {
                      if (data.length >= 0) {
                        continuinReviewDetailObj.research_progress_info.documents =
                          data || {}
                      } else {
                        continuinReviewDetailObj.research_progress_info.documents =
                          []
                      }
                      return res.status(200).json(continuinReviewDetailObj)
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
}

export const getProtocolDetailsById = (req, res) => {
  const protocolDetailsObj = {}
  if (req.body.protocolType === 'Clinical Site') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.protocol_information = data[0] || {}
        const docQue =
          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
        db.query(
          docQue,
          [req.body.protocolId, 'protocol_information'],
          (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.protocol_information.documents = data || {}
            } else {
              protocolDetailsObj.protocol_information.documents = []
            }
          }
        )
        const que2 =
          'select * from investigator_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.investigator_information = data[0] || {}
            const docQue =
              'select * from protocol_documents where protocol_id = ? AND information_type = ?'
            db.query(
              docQue,
              [req.body.protocolId, 'investigator_information'],
              (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.investigator_information.documents =
                    data || {}
                } else {
                  protocolDetailsObj.investigator_information.documents = []
                }
              }
            )
            const que3 = 'select * from study_information where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.study_information = data[0] || {}
                const docQue =
                  'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                db.query(
                  docQue,
                  [req.body.protocolId, 'study_information'],
                  (err, data) => {
                    if (data.length >= 0) {
                      protocolDetailsObj.study_information.documents =
                        data || {}
                    } else {
                      protocolDetailsObj.study_information.documents = []
                    }
                  }
                )
                const que4 =
                  'select * from informed_consent where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.informed_consent = data[0] || {}
                    const docQue =
                      'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                    db.query(
                      docQue,
                      [req.body.protocolId, 'informed_consent'],
                      (err, data) => {
                        if (data.length >= 0) {
                          protocolDetailsObj.informed_consent.documents = data
                        } else {
                          protocolDetailsObj.informed_consent.documents = []
                        }
                      }
                    )
                    const que5 =
                      'select * from protocol_procedure where protocol_id = ?'
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolDetailsObj.protocol_procedure = data[0] || {}
                        const docQue =
                          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                        db.query(
                          docQue,
                          [req.body.protocolId, 'protocol_procedure'],
                          (err, data) => {
                            if (data.length >= 0) {
                              protocolDetailsObj.protocol_procedure.documents =
                                data
                            } else {
                              protocolDetailsObj.protocol_procedure.documents =
                                []
                            }
                          }
                        )
                        const que6 =
                          'select applicant_terms, applicant_acknowledge, applicant_acknowledge_name from protocols where protocol_id = ?'
                        db.query(que6, [req.body.protocolId], (err, data) => {
                          if (data.length >= 0) {
                            protocolDetailsObj.submission_information = data[0]
                          } else {
                            protocolDetailsObj.submission_information = []
                          }
                          return res.status(200).json(protocolDetailsObj)
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  } else if (req.body.protocolType === 'Multi-Site Sponsor') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.protocol_information = data[0] || {}
        const docQue =
          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
        db.query(
          docQue,
          [req.body.protocolId, 'protocol_information'],
          (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.protocol_information.documents = data
            } else {
              protocolDetailsObj.protocol_information.documents = []
            }
          }
        )
        const que2 = 'select * from contact_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.contact_information = data[0] || {}
            const docQue =
              'select * from protocol_documents where protocol_id = ? AND information_type = ?'
            db.query(
              docQue,
              [req.body.protocolId, 'contact_information'],
              (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.contact_information.documents = data
                } else {
                  protocolDetailsObj.contact_information.documents = []
                }
              }
            )
            const que3 = 'select * from study_information where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.study_information = data[0] || {}
                const docQue =
                  'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                db.query(
                  docQue,
                  [req.body.protocolId, 'study_information'],
                  (err, data) => {
                    if (data.length >= 0) {
                      protocolDetailsObj.study_information.documents = data
                    } else {
                      protocolDetailsObj.study_information.documents = []
                    }
                  }
                )
                const que4 =
                  'select * from informed_consent where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.informed_consent = data[0] || {}
                    const docQue =
                      'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                    db.query(
                      docQue,
                      [req.body.protocolId, 'informed_consent'],
                      (err, data) => {
                        if (data.length >= 0) {
                          protocolDetailsObj.informed_consent.documents = data
                        } else {
                          protocolDetailsObj.informed_consent.documents = []
                        }
                      }
                    )
                    const que5 =
                      'select * from protocol_procedure where protocol_id = ?'
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolDetailsObj.protocol_procedure = data[0] || {}
                        const docQue =
                          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                        db.query(
                          docQue,
                          [req.body.protocolId, 'protocol_procedure'],
                          (err, data) => {
                            if (data.length >= 0) {
                              protocolDetailsObj.protocol_procedure.documents =
                                data
                            } else {
                              protocolDetailsObj.protocol_procedure.documents =
                                []
                            }
                          }
                        )
                        const que6 =
                          'select applicant_terms, applicant_acknowledge, applicant_acknowledge_name from protocols where protocol_id = ?'
                        db.query(que6, [req.body.protocolId], (err, data) => {
                          if (data.length >= 0) {
                            protocolDetailsObj.submission_information =
                              data[0] || {}
                            const que7 =
                              'select applicant_terms, applicant_acknowledge, applicant_acknowledge_name from protocols where protocol_id = ?'
                            db.query(
                              que7,
                              [req.body.protocolId],
                              (err, data) => {
                                if (data.length >= 0) {
                                  protocolDetailsObj.submission_information =
                                    data[0] || {}
                                  const que4 =
                                    'select * from external_monitor_protocol where protocol_id = ?'
                                  db.query(
                                    que4,
                                    [req.body.protocolId],
                                    (err, data) => {
                                      if (data.length >= 0) {
                                        protocolDetailsObj.clinical_trail_monitor_information =
                                          data[0] || {}
                                      }
                                      return res
                                        .status(200)
                                        .json(protocolDetailsObj)
                                    }
                                  )
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
          }
        })
      }
    })
  } else if (req.body.protocolType === 'Document Review') {
    const que1 = 'select * from protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.protocol_information = data[0] || {}
        const docQue =
          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
        db.query(
          docQue,
          [req.body.protocolId, 'protocol_information'],
          (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.protocol_information.documents = data || {}
            } else {
              protocolDetailsObj.protocol_information.documents = []
            }
          }
        )
        const que2 =
          'select * from investigator_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.investigator_information = data[0] || {}
            const docQue =
              'select * from protocol_documents where protocol_id = ? AND information_type = ?'
            db.query(
              docQue,
              [req.body.protocolId, 'investigator_information'],
              (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.investigator_information.documents =
                    data || {}
                } else {
                  protocolDetailsObj.investigator_information.documents = []
                }
              }
            )
            const que3 = 'select * from informed_consent where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.informed_consent = data[0] || {}
                const docQue =
                  'select * from protocol_documents where protocol_id = ? AND information_type = ?'
                db.query(
                  docQue,
                  [req.body.protocolId, 'informed_consent'],
                  (err, data) => {
                    if (data.length >= 0) {
                      protocolDetailsObj.informed_consent.documents = data || {}
                    } else {
                      protocolDetailsObj.informed_consent.documents = []
                    }
                  }
                )
                const que4 =
                  'select applicant_terms, applicant_acknowledge, applicant_acknowledge_name from protocols where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.submission_information = data[0] || {}
                    return res.status(200).json(protocolDetailsObj)
                  }
                })
              }
            })
          }
        })
      }
    })
  } else {
    const que1 =
      'select * from investigator_protocol_information where protocol_id = ?'
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.investigator_protocol_information = data[0] || {}
        const docQue =
          'select * from protocol_documents where protocol_id = ? AND information_type = ?'
        db.query(
          docQue,
          [req.body.protocolId, 'investigator_protocol_information'],
          (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.investigator_protocol_information.documents =
                data
            } else {
              protocolDetailsObj.investigator_protocol_information.documents =
                []
            }
          }
        )
        const que2 =
          'select * from clinical_consent_information where protocol_id = ?'
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.consent_information = data[0] || {}
            const docQue =
              'select * from protocol_documents where protocol_id = ? AND information_type = ?'
            db.query(
              docQue,
              [req.body.protocolId, 'consent_information'],
              (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.consent_information.documents = data
                } else {
                  protocolDetailsObj.consent_information.documents = []
                }
              }
            )
            const que3 =
              'select applicant_terms, applicant_acknowledge, applicant_acknowledge_name from protocols where protocol_id = ?'
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.submission_information = data[0] || {}
                const que4 =
                  'select * from external_monitor_protocol where protocol_id = ?'
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.clinical_trail_monitor_information =
                      data[0] || {}
                  }
                  return res.status(200).json(protocolDetailsObj)
                })
              }
            })
          }
        })
      }
    })
  }
}

export const getStudyCloseoutRequestList = (req, res) => {
  const que = 'select * from study_closeout_request'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getPromptlyReportableEventList = (req, res) => {
  const que = 'select * from promptly_reportable_event'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getAdverseEventList = (req, res) => {
  const que = 'select * from adverse_event'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getProtocolAmendmentRequestList = (req, res) => {
  const que = 'select * from protocol_amendment_request'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getStudyCloseoutDetailsById = (req, res) => {
  const que = 'select * from study_closeout_request where protocol_id = ?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getPromptlyReportableEventById = (req, res) => {
  const que = 'select * from promptly_reportable_event where protocol_id = ?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getAdverseEventById = (req, res) => {
  const que = 'select * from adverse_event where protocol_id = ?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getProtocolAmendmentRequestById = (req, res) => {
  const protocolAmendmentRequestDetailObj = {}
  const que = 'select * from protocol_amendment_request where protocol_id = ?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (data.length >= 0) {
      protocolAmendmentRequestDetailObj.protocol_amendment_request =
        data[0] || {}
      const docQue =
        'select * from protocol_documents where protocol_id = ? AND information_type = ?'
      db.query(
        docQue,
        [req.body.protocolId, 'protocol_amendment'],
        (err, data) => {
          if (data.length >= 0) {
            protocolAmendmentRequestDetailObj.protocol_amendment_request.documents =
              data || {}
          } else {
            protocolAmendmentRequestDetailObj.protocol_amendment_request.documents =
              []
          }
          return res.status(200).json(protocolAmendmentRequestDetailObj)
        }
      )
    }
  })
}

export const createMemberEvent = (req, res) => {
  const que =
    'insert into member_event (`protocol_id`, `event_subject`, `event_message`, `member_id`, `created_by`, `protocol_name`) value (?)'
  const values = [
    req.body.protocol_id,
    req.body.event_subject,
    req.body.event_message,
    req.body.member_id.toString(),
    req.body.created_by,
    req.body.protocol_name
  ]
  db.query(que, [values], (err, data) => {
    if (err) {
      return res.status(500).json(err)
    } else {
      let result = {}
      result.status = 200
      result.msg = 'Event has been created Successfully.'
      return res.json(result)
    }
  })
}

export const memberEventList = (req, res) => {
  const que =
    "SELECT me.id, me.*, GROUP_CONCAT(users.name SEPARATOR ', ') AS members FROM member_event AS me JOIN users AS users ON FIND_IN_SET(users.id, me.member_id) > 0 WHERE me.status =? GROUP BY me.id"
  db.query(que, [1], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

// export const assignProtocolToMembers = (req, res) => {
//     const member_ids = req.body.member_id
//     for (const member_id of member_ids) {
//         console.log('member_ids', member_ids)
//         console.log('member_id', member_id)
//         const que = 'insert into members_protocol (`protocol_id`, `protocol_name`,`member_id`,`created_by`) value (?)'
//         const values = [
//             req.body.protocol_id,
//             req.body.protocol_name,
//             member_id,
//             req.body.created_by,
//         ]
//         db.query(que, [values], (err, data) => {
//             if (err) return res.status(500).json(err)
//             return res.status(200).json('Protocol Assigned to Members Successfully.')
//         })
//     }
// }

export const assignProtocolToMembers = async (req, res) => {
  const { member_id, protocol_id, protocol_name, created_by } = req.body
  try {
    // Check if member_id is an array and has at least one item
    if (!Array.isArray(member_id) || member_id.length === 0) {
      return res.status(500).json({ msg: 'No members provided.' })
    }
    // Prepare the query and values
    const que =
      'INSERT INTO members_protocol (protocol_id, protocol_name, member_id, created_by) VALUES (?, ?, ?, ?)'
    // Create a promise for each insert operation
    const insertPromises = member_id.map((id) => {
      const values = [protocol_id, protocol_name, id, created_by]
      return new Promise((resolve, reject) => {
        db.query(que, values, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
    })
    // Wait for all insertions to complete
    await Promise.all(insertPromises)
    // Send a response after all insertions
    let result = {}
    result.status = 200
    result.msg = 'Protocol Assigned to Members Successfully.'
    return res.json(result)
  } catch (error) {
    console.error('Error assigning protocol:', error)
    res
      .status(500)
      .json({ msg: 'An error occurred while assigning protocol to members.' })
  }
}

export const assignedMembersList = (req, res) => {
  const que =
    'SELECT mp.*, users.name FROM members_protocol as mp JOIN users ON mp.member_id = users.id AND mp.protocol_id=?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const assignedMembersProtocolList = (req, res) => {
  const que = 'SELECT * FROM members_protocol WHERE member_id=?'
  db.query(que, [req.body.memberId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const votingMemberApprovalProtocol = (req, res) => {
  var datetime = new Date()
  const que =
    'UPDATE members_protocol SET protocol=?, consent=?, supported_documents=?, comment=?, electronic_signature=?, completed_date=? WHERE id=?'
  db.query(
    que,
    [
      req.body.protocol,
      req.body.consent,
      req.body.supported_documents,
      req.body.comment,
      req.body.electronic_signature,
      datetime.toISOString().slice(0, 10),
      req.body.id
    ],
    (err, data) => {
      if (err) {
        return res.status(500).json(err)
      } else {
        let result = {}
        result.status = 200
        result.msg = 'Protocol Approved Successfully'
        return res.json(result)
      }
    }
  )
}

export const approvedProtocolsByMembersList = (req, res) => {
  const que =
    'SELECT mp.*, users.name FROM members_protocol as mp JOIN users ON mp.member_id = users.id AND mp.protocol_id=?'
  db.query(que, [req.body.protocolId], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getContinueinProtocolList = (req, res) => {
  const que = 'select * from protocols WHERE continuein_review_status=?'
  db.query(que, [2], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getAllProtocolList = (req, res) => {
  const que =
    'SELECT ps.*, users.name, users.mobile, users.email, users.city FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status!=1'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}
