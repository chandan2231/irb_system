import { db } from "../connect.js"

export const getProtocolList = (req, res) => {
    // console.log('res', res)
    // return;
    const que = "select * from user_research"
    db.query(que, {}, (err, data) =>{
        if (err) return res.status(500).json(err)
        if (data.length >= 0 ) {
            return res.status(200).json(data)
        }
    })
}
export const getAllUsers = (req, res) => {
    const que = "select * from users where researcher_type != ?"
    db.query(que, ['admin'], (err, data) =>{
        if (err) return res.status(500).json(err)
        if (data.length >= 0 ) {
            return res.status(200).json(data)
        }
    })
}
export const getContinuinDetailsById = (req, res) => {
    // console.log('req', req)
    // console.log('req.body', req.body.protocolId)
    // return;
    const continuinReviewDetailObj = {}
    const que = "select * from risk_assessment where protocol_id = ?"
    db.query(que, [req.body.protocolId], (err, data) =>{
        if (data.length >= 0 ) {
            continuinReviewDetailObj.risk_assessment = data[0] || {}
            const que2 = "select * from informed_consent_process where protocol_id = ?"
            db.query(que2, [req.body.protocolId], (err, data) =>{
                if (data.length >= 0 ) {
                    continuinReviewDetailObj.informed_consent_process = data[0]
                    const que3 = "select * from investigator_instuation_info where protocol_id = ?"
                    db.query(que3, [req.body.protocolId], (err, data) =>{
                        if (data.length >= 0 ) {
                            continuinReviewDetailObj.investigator_instuation_info = data[0] || {}
                            const que4 = "select * from research_process_info where protocol_id = ?"
                            db.query(que4, [req.body.protocolId], (err, data) => {
                                if (data.length >= 0 ) {
                                    continuinReviewDetailObj.research_process_info = data[0] || {}
                                }
                                return res.status(200).json(continuinReviewDetailObj)
                            })
                        } 
                    })
                }
            })
        }
    })
    
    // console.log('continuinReviewDetailObj', continuinReviewDetailObj)
    // return res.status(200).json(continuinReviewDetailObj)
}
