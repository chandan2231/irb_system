import { db } from "../connect.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { generatePdfFromHTML } from "../utils/pdfService.js"
import * as s3Service from '../utils/s3Service.js'

export const getProtocolList = (req, res) => {
    // console.log('res', res)
    // return;
    const que = "select * from user_research where added_by = ?"
    db.query(que, [req.body.login_id], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length >= 0) {
            return res.status(200).json(data)
        }
    })
}

export const createProtocol = (req, res) => {
    // CHECK RESEARCH TYPE IF EXIST
    const que = "select * from user_research where research_type = ? AND added_by = ?"
    db.query(que, [req.body.research_type_id, req.body.login_id], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length > 0) {
            return res.status(400).json('You have already added the selected research type, try with other')
        }
        // CREATE A NEW Entry
        const protocolNumber = "IRB" + Math.floor(Math.random() * 899999 + 100000);
        const que2 = 'insert into user_research (`protocol_id`, `research_type`, `added_by`, `added_timestamp`, `updated_timestamp`) value (?)';
        const protocolValue = [
            protocolNumber,
            req.body.research_type_id,
            req.body.login_id,
            new Date().getTime(),
            new Date().getTime(),
        ]
        db.query(que2, [protocolValue], (err2, data) => {
            if (err2) return res.status(500).json(err2)
            return res.status(200).json('Research type has been created.')
        })
    })

}


export const saveFile = async (req, res) => {
    var datetime = new Date();
    try {
        if (req.file) {
            let sRL = await s3Service.uploadFile(req.file.path);
            let imageUrl = sRL.cdnUrl;
            // Remove the file from the local server
            fs.unlinkSync(req.file.path);
            if(req.body.protocolType === 'continuein_review'){
                const que2 = 'insert into continuein_review_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)';
                const protocolValue = [
                    req.body.protocolId,
                    req.body.protocolType,
                    req.body.informationType,
                    req.body.documentName,
                    req.file.filename,
                    imageUrl,
                    req.body.createdBy,
                    datetime.toISOString().slice(0,10),
                    datetime.toISOString().slice(0,10),
                ]
                db.query(que2, [protocolValue], (err, data) => {
                    if (err) return res.status(500).json(err)
                    if (data) {
                        return res.status(200).json({ id: data.insertId })
                    }
                })
            } else {
                const que2 = 'insert into protocol_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)';
                const protocolValue = [
                    req.body.protocolId,
                    req.body.protocolType,
                    req.body.informationType,
                    req.body.documentName,
                    req.file.filename,
                    imageUrl,
                    req.body.createdBy,
                    datetime.toISOString().slice(0,10),
                    datetime.toISOString().slice(0,10),
                ]
                db.query(que2, [protocolValue], (err, data) => {
                    if (err) return res.status(500).json(err)
                    if (data) {
                        return res.status(200).json({ id: data.insertId })
                    }
                })
            }
            
        }
        else {
            return res.status(400).json({ message: 'No file uploaded' });
        }

    } catch (error) {
        console.log({ error })
        fs.unlinkSync(req.file?.path);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const generatePdf = async (req, res) => {
    console.log("reqreqreq", req.body)
    const continuinReviewDetailObj = {}
    const que = "select * from risk_assessment where protocol_id = ?"
    db.query(que, [req.body.protocolId], (err, data) => {
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
                                    db.query(docQue, [req.body.protocolId, 'research_progress'],async (err, data) => {
                                        if (data.length >= 0 ) {
                                            continuinReviewDetailObj.research_progress_info.documents = data || {}
                                        } else {
                                            continuinReviewDetailObj.research_progress_info.documents = []
                                        }
                                        console.log('continuinReviewDetailObj', continuinReviewDetailObj)
                                        try {
                                            let file = {
                                                content: `
                                                    <div style='page-break-after: always;'>
                                                        <h3>Risk Assessment</h3>
                                                        <div>
                                                            <h4>Question 1</h4> 
                                                            <br />
                                                            <span>Answer One</span></h3>
                                                            <h3>Question Two: <span>Answer Two</span></h3>
                                                            <h3>Question Three: <span>Answer Three</span></h3>
                                                        </div>
                                                    </div>
                                                    <div style='page-break-after: always;'>
                                                        <h1 style='text-align: center'>Title of Page 2</h1>
                                                        <div>
                                                            <h3>Question One: <span>Answer One</span></h3>
                                                            <h3>Question Two: <span>Answer Two</span></h3>
                                                            <h3>Question Three: <span>Answer Three</span></h3>
                                                        </div>
                                                    </div>
                                                `
                                            };
                                            let filePath = await generatePdfFromHTML(file)
                                            console.log('filePath', filePath)
                                            let sRL = await s3Service.uploadFile(filePath);
                                            console.log('sRL', sRL)
                                            let pdfUrl = sRL.cdnUrl;
                                            // Remove the file from the local server
                                            fs.unlinkSync(filePath);
                                            return res.status(200).json({ pdfUrl })
                                        } catch (error) {
                                            console.log(error)
                                            return res.status(500).json({ message: 'Internal Server Error' });
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
    return;
    
}