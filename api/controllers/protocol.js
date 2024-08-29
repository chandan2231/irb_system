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
            const que2 = 'insert into documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)';
            const protocolValue = [
                req.file.protocolId,
                req.file.protocolType,
                req.file.informationType,
                req.file.documentName,
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



    
    try {
        let file = {
            content: `
                <div style='page-break-after: always;'>
                    <h1 style='text-align: center'>Title of Page 1</h1>
                    <div>
                        <h3>Question One: <span>Answer One</span></h3>
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

        let sRL = await s3Service.uploadFile(filePath);
        let pdfUrl = sRL.cdnUrl;
        // Remove the file from the local server
        fs.unlinkSync(filePath);

        return res.status(200).json({ pdfUrl })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}