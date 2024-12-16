import { db } from '../connect.js'
import bcrypt from 'bcryptjs'

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

export const createMember = (req, res) => {
  // CHECK MEMBER IF EXIST
  const que = 'select * from users where email = ?'
  db.query(que, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length > 0) {
      return res.status(409).json('Email already exist try with other email')
    }
    // CREATE A NEW MEMBER
    // hash the password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)
    const que =
      'insert into users (`name`, `mobile`, `email`,  `password`, `researcher_type`, `user_type`) value (?)'
    const values = [
      req.body.name,
      req.body.phone,
      req.body.email,
      hashedPassword,
      'member',
      req.body.user_type
    ]
    db.query(que, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('Member has been created Successfully.')
    })
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

export const getApprovedProtocolList = (req, res) => {
  const que =
    'SELECT ps.*, users.name, users.mobile, users.email, users.city FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=3'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getUnderReviewProtocolList = (req, res) => {
  const que =
    'SELECT ps.*, users.name, users.mobile, users.email, users.city FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=2'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
  })
}

export const getCreatedProtocolList = (req, res) => {
  const que =
    'SELECT ps.*, users.name, users.mobile, users.email, users.city FROM protocols as ps JOIN users ON ps.added_by = users.id AND ps.status=1'
  db.query(que, {}, (err, data) => {
    if (err) return res.status(500).json(err)
    if (data.length >= 0) {
      return res.status(200).json(data)
    }
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
                            return res.status(200).json(protocolDetailsObj)
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
                            return res.status(200).json(protocolDetailsObj)
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
                return res.status(200).json(protocolDetailsObj)
              }
            )
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
    const que = 'insert into member_event (`protocol_id`, `event_subject`, `event_message`, `member_id`, `created_by`, `protocol_name`) value (?)';
    const values = [
        req.body.protocol_id,
        req.body.event_subject,
        req.body.event_message,
        req.body.member_id.toString(),
        req.body.created_by,
        req.body.protocol_name
    ];
    db.query(que, [values], (err, data) =>{
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
    const que = "SELECT me.id, me.*, GROUP_CONCAT(users.name SEPARATOR ', ') AS members FROM member_event AS me JOIN users AS users ON FIND_IN_SET(users.id, me.member_id) > 0 WHERE me.status =? GROUP BY me.id"
    db.query(que, [1], (err, data) =>{
        if (err) return res.status(500).json(err)
        if (data.length >= 0 ) {
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
    const { member_id, protocol_id, protocol_name, created_by } = req.body;
    try {
        // Check if member_id is an array and has at least one item
        if (!Array.isArray(member_id) || member_id.length === 0) {
            return res.status(500).json({ msg: 'No members provided.' });
        }
        // Prepare the query and values
        const que = 'INSERT INTO members_protocol (protocol_id, protocol_name, member_id, created_by) VALUES (?, ?, ?, ?)';
        // Create a promise for each insert operation
        const insertPromises = member_id.map(id => {
            const values = [protocol_id, protocol_name, id, created_by];
            return new Promise((resolve, reject) => {
                db.query(que, values, (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        });
        // Wait for all insertions to complete
        await Promise.all(insertPromises);
        // Send a response after all insertions
        let result = {}
        result.status = 200
        result.msg = 'Protocol Assigned to Members Successfully.'
        return res.json(result)
    } catch (error) {
        console.error('Error assigning protocol:', error);
        res.status(500).json({ msg: 'An error occurred while assigning protocol to members.' });
    }
};

export const assignedMembersList = (req, res) => {
    const que = 'SELECT mp.*, users.name FROM members_protocol as mp JOIN users ON mp.member_id = users.id AND mp.protocol_id=?'
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
    const que = 'UPDATE members_protocol SET protocol=?, consent=?, supported_documents=?, comment=?, electronic_signature=?, completed_date=? WHERE id=?'
    db.query(que, [req.body.protocol, req.body.consent, req.body.supported_documents, req.body.comment, req.body.electronic_signature, datetime.toISOString().slice(0, 10), req.body.id], (err, data) => {
      if (err) {
        return res.status(500).json(err)
      } else {
        let result = {}
        result.status = 200
        result.msg = 'Protocol Approved Successfully'
        return res.json(result)
      }
    })
}

export const approvedProtocolsByMembersList = (req, res) => {
    const que = 'SELECT mp.*, users.name FROM members_protocol as mp JOIN users ON mp.member_id = users.id AND mp.protocol_id=?'
    db.query(que, [req.body.protocolId], (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length >= 0) {
        return res.status(200).json(data)
      }
    })
}

export const chairCommitteeApprovalProtocol = (req, res) => {
    var datetime = new Date()
    let protocolStatus = req.body.protocol === 'Approve' ? 3 : req.body.protocol === 'Under Review' ? 2 :  req.body.protocol === 'Rejected' ? 4 : 5
    const que = 'UPDATE protocols SET status=?, comment=?, electronic_signature=?, approval_date_by_chair_committee=? WHERE protocol_id=?'
    db.query(que, [protocolStatus, req.body.comment, req.body.electronic_signature, datetime.toISOString().slice(0, 10), req.body.protocol_id], (err, data) => {
      if (err) {
        return res.status(500).json(err)
      } else {
        let result = {}
        result.status = 200
        result.msg = 'Protocol Details updated Successfully'
        return res.json(result)
      }
    })
}

            
            
