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
    const continuinReviewDetailObj = {}
    const que = "select * from risk_assessment where protocol_id = ?"
    db.query(que, [req.body.protocolId], (err, data) =>{
        if (data.length >= 0 ) {
            continuinReviewDetailObj.risk_assessment = data[0] || {}
            const que2 = "select * from informed_consent_process where protocol_id = ?"
            db.query(que2, [req.body.protocolId], (err, data) =>{
                if (data.length >= 0 ) {
                    continuinReviewDetailObj.informed_consent_process = data[0] || {}
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
}

export const getProtocolDetailsById = (req, res) => {
    // console.log('req', req)
    // console.log('req.body', req.body.protocolId)
    // return;
    const protocolDetailsObj = {}
    if(req.body.protocolType === 'Contractor Researcher'){
        const que1 = "select * from protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.protocol_information = data[0] || {}
                const que2 = "select * from investigator_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.investigator_information = data[0] || {}
                        const que3 = "select * from study_information where protocol_id = ?"
                        db.query(que3, [req.body.protocolId], (err, data) =>{
                            if (data.length >= 0 ) {
                                protocolDetailsObj.study_information = data[0] || {}
                                const que4 = "select * from informed_consent where protocol_id = ?"
                                db.query(que4, [req.body.protocolId], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.informed_consent = data[0] || {}
                                        const que5 = "select * from protocol_procedure where protocol_id = ?"
                                        db.query(que5, [req.body.protocolId], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.protocol_procedure = data[0] || {}
                                                return res.status(200).json(protocolDetailsObj)
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
    } else if (req.body.protocolType === 'Multi Site Sponsor') {
        const que1 = "select * from protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.protocol_information = data[0] || {}
                const que2 = "select * from contact_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.contact_information = data[0] || {}
                        const que3 = "select * from study_information where protocol_id = ?"
                        db.query(que3, [req.body.protocolId], (err, data) =>{
                            if (data.length >= 0 ) {
                                protocolDetailsObj.study_information = data[0] || {}
                                const que4 = "select * from informed_consent where protocol_id = ?"
                                db.query(que4, [req.body.protocolId], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.informed_consent = data[0] || {}
                                        const que5 = "select * from protocol_procedure where protocol_id = ?"
                                        db.query(que5, [req.body.protocolId], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.protocol_procedure = data[0] || {}
                                                return res.status(200).json(protocolDetailsObj)
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
        const que1 = "select * from investigator_protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.investigator_protocol_information = data[0] || {}
                const que2 = "select * from clinical_consent_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.consent_information = data[0] || {}
                        return res.status(200).json(protocolDetailsObj)
                    }
                })
            }
        })
    }
    
}
