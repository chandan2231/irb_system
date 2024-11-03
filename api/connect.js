// import mysql from "mysql"

// export const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'irb_system',
//     port: 3306
// })

// db.connect(function(err) {
//     if (err) throw err
//     console.log('You are now connected...')
// })

import mysql from 'mysql2'
import dotenv from 'dotenv'

// Importing the .env.local file
dotenv.config({ path: `.env.local`, override: true })

const { HOST_NAME, USER_NAME, PASSWORD, DATABASE, PORT } = process.env

export const db = mysql.createConnection({
  host: HOST_NAME,
  user: USER_NAME,
  password: PASSWORD,
  database: DATABASE,
  port: PORT
})

db.connect(function (err) {
  if (err) throw err
  console.log('You are now connected...')
})
