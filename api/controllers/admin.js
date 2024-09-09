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
            const docQue = "select * from continuein_review_documents where protocol_id = ? AND information_type = ?"
            db.query(docQue, [req.body.protocolId, 'risk_assessment'], (err, data) => {
                if (data.length >= 0 ) {
                    continuinReviewDetailObj.risk_assessment.documents = data || {}
                } else {
                    continuinReviewDetailObj.risk_assessment.documents = []
                }
            })
            const que2 = "select * from informed_consent_process where protocol_id = ?"
            db.query(que2, [req.body.protocolId], (err, data) =>{
                if (data.length >= 0 ) {
                    continuinReviewDetailObj.informed_consent_process = data[0] || {}
                    const docQue = "select * from continuein_review_documents where protocol_id = ? AND information_type = ?"
                    db.query(docQue, [req.body.protocolId, 'informed_consent_process'], (err, data) => {
                        if (data.length >= 0 ) {
                            continuinReviewDetailObj.informed_consent_process.documents = data || {}
                        } else {
                            continuinReviewDetailObj.informed_consent_process.documents = []
                        }
                    })
                    const que3 = "select * from investigator_instuation_info where protocol_id = ?"
                    db.query(que3, [req.body.protocolId], (err, data) =>{
                        if (data.length >= 0 ) {
                            continuinReviewDetailObj.investigator_instuation_info = data[0] || {}
                            const docQue = "select * from continuein_review_documents where protocol_id = ? AND information_type = ?"
                            db.query(docQue, [req.body.protocolId, 'investigator_and_institution'], (err, data) => {
                                if (data.length >= 0 ) {
                                    continuinReviewDetailObj.investigator_instuation_info.documents = data || {}
                                } else {
                                    continuinReviewDetailObj.investigator_instuation_info.documents = []
                                }
                            })
                            const que4 = "select * from research_progress_info where protocol_id = ?"
                            db.query(que4, [req.body.protocolId], (err, data) => {
                                if (data.length >= 0 ) {
                                    continuinReviewDetailObj.research_progress_info = data[0] || {}
                                    const docQue = "select * from continuein_review_documents where protocol_id = ? AND information_type = ?"
                                    db.query(docQue, [req.body.protocolId, 'research_progress'], (err, data) => {
                                        if (data.length >= 0 ) {
                                            continuinReviewDetailObj.research_progress_info.documents = data || {}
                                        } else {
                                            continuinReviewDetailObj.research_progress_info.documents = []
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
    })
}

export const getProtocolDetailsById = (req, res) => {
    const protocolDetailsObj = {}
    if(req.body.protocolType === 'Clinical Site'){
        const que1 = "select * from protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.protocol_information = data[0] || {}
                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                db.query(docQue, [req.body.protocolId, 'protocol_information'], (err, data) => {
                    if (data.length >= 0 ) {
                        protocolDetailsObj.protocol_information.documents = data || {}
                    } else {
                        protocolDetailsObj.protocol_information.documents = []
                    }
                })
                const que2 = "select * from investigator_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.investigator_information = data[0] || {}
                        const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                        db.query(docQue, [req.body.protocolId, 'investigator_information'], (err, data) => {
                            if (data.length >= 0 ) {
                                protocolDetailsObj.investigator_information.documents = data || {}
                            } else {
                                protocolDetailsObj.investigator_information.documents = []
                            }
                        })
                        const que3 = "select * from study_information where protocol_id = ?"
                        db.query(que3, [req.body.protocolId], (err, data) =>{
                            if (data.length >= 0 ) {
                                protocolDetailsObj.study_information = data[0] || {}
                                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                db.query(docQue, [req.body.protocolId, 'study_information'], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.study_information.documents = data || {}
                                    } else {
                                        protocolDetailsObj.study_information.documents = []
                                    }
                                })
                                const que4 = "select * from informed_consent where protocol_id = ?"
                                db.query(que4, [req.body.protocolId], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.informed_consent = data[0] || {}
                                        const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                        db.query(docQue, [req.body.protocolId, 'informed_consent'], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.informed_consent.documents = data
                                            } else {
                                                protocolDetailsObj.informed_consent.documents = []
                                            }
                                        })
                                        const que5 = "select * from protocol_procedure where protocol_id = ?"
                                        db.query(que5, [req.body.protocolId], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.protocol_procedure = data[0] || {}
                                                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                                db.query(docQue, [req.body.protocolId, 'protocol_procedure'], (err, data) => {
                                                    if (data.length >= 0 ) {
                                                        protocolDetailsObj.protocol_procedure.documents = data
                                                    } else {
                                                        protocolDetailsObj.protocol_procedure.documents = []
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
    } else if (req.body.protocolType === 'Multi Site Sponsor') {
        const que1 = "select * from protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.protocol_information = data[0] || {}
                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                db.query(docQue, [req.body.protocolId, 'protocol_information'], (err, data) => {
                    if (data.length >= 0 ) {
                        protocolDetailsObj.protocol_information.documents = data
                    } else {
                        protocolDetailsObj.protocol_information.documents = []
                    }
                })
                const que2 = "select * from contact_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.contact_information = data[0] || {}
                        const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                        db.query(docQue, [req.body.protocolId, 'contact_information'], (err, data) => {
                            if (data.length >= 0 ) {
                                protocolDetailsObj.contact_information.documents = data
                            } else {
                                protocolDetailsObj.contact_information.documents = []
                            }
                        })
                        const que3 = "select * from study_information where protocol_id = ?"
                        db.query(que3, [req.body.protocolId], (err, data) =>{
                            if (data.length >= 0 ) {
                                protocolDetailsObj.study_information = data[0] || {}
                                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                db.query(docQue, [req.body.protocolId, 'study_information'], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.study_information.documents = data
                                    } else {
                                        protocolDetailsObj.study_information.documents = []
                                    }
                                })
                                const que4 = "select * from informed_consent where protocol_id = ?"
                                db.query(que4, [req.body.protocolId], (err, data) => {
                                    if (data.length >= 0 ) {
                                        protocolDetailsObj.informed_consent = data[0] || {}
                                        const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                        db.query(docQue, [req.body.protocolId, 'informed_consent'], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.informed_consent.documents = data
                                            } else {
                                                protocolDetailsObj.informed_consent.documents = []
                                            }
                                        })
                                        const que5 = "select * from protocol_procedure where protocol_id = ?"
                                        db.query(que5, [req.body.protocolId], (err, data) => {
                                            if (data.length >= 0 ) {
                                                protocolDetailsObj.protocol_procedure = data[0] || {}
                                                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                                                db.query(docQue, [req.body.protocolId, 'protocol_procedure'], (err, data) => {
                                                    if (data.length >= 0 ) {
                                                        protocolDetailsObj.protocol_procedure.documents = data
                                                    } else {
                                                        protocolDetailsObj.protocol_procedure.documents = []
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
    } else {
        const que1 = "select * from investigator_protocol_information where protocol_id = ?"
        db.query(que1, [req.body.protocolId], (err, data) =>{
            if (data.length >= 0 ) {
                protocolDetailsObj.investigator_protocol_information = data[0] || {}
                const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                db.query(docQue, [req.body.protocolId, 'investigator_protocol_information'], (err, data) => {
                    if (data.length >= 0 ) {
                        protocolDetailsObj.investigator_protocol_information.documents = data
                    } else {
                        protocolDetailsObj.investigator_protocol_information.documents = []
                    }
                })
                const que2 = "select * from clinical_consent_information where protocol_id = ?"
                db.query(que2, [req.body.protocolId], (err, data) =>{
                    if (data.length >= 0 ) {
                        protocolDetailsObj.consent_information = data[0] || {}
                        const docQue = "select * from protocol_documents where protocol_id = ? AND information_type = ?"
                        db.query(docQue, [req.body.protocolId, 'consent_information'], (err, data) => {
                            if (data.length >= 0 ) {
                                protocolDetailsObj.consent_information.documents = data
                            } else {
                                protocolDetailsObj.consent_information.documents = []
                            }
                            return res.status(200).json(protocolDetailsObj)
                        })
                    }
                })
            }
        })
    }
}
