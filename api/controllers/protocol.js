import { db } from "../connect.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const getProtocolList = (req, res) => {
    // console.log('res', res)
    // return;
    const que = "select * from user_research where added_by = ?"
    db.query(que, [req.body.login_id], (err, data) =>{
        if (err) return res.status(500).json(err)
        if (data.length >= 0 ) {
            return res.status(200).json(data)
        }
    })
}

export const createProtocol = (req, res) => {
    // CHECK RESEARCH TYPE IF EXIST
    const que = "select * from user_research where research_type = ? AND added_by = ?"
    db.query(que, [req.body.research_type_id, req.body.login_id], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length > 0 ) {
            return res.status(400).json('You have already added the selected research type, try with other')
        }
        // CREATE A NEW Entry
        const protocolNumber = "IRB"+Math.floor(Math.random()*899999+100000);
        const que2 = 'insert into user_research (`protocol_id`, `research_type`, `added_by`, `added_timestamp`, `updated_timestamp`) value (?)';
        const protocolValue = [
            protocolNumber, 
            req.body.research_type_id, 
            req.body.login_id,
            new Date().getTime(),
            new Date().getTime(),
        ]
        db.query(que2, [protocolValue], (err2, data) =>{
            if (err2) return res.status(500).json(err2)
            return res.status(200).json('Research type has been created.')
        })
    })
    
}
