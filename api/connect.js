import mysql from "mysql"

export const db = mysql.createConnection({
    host: 'localhost',
    username: 'root',
    password: 'root',
    database: 'irb_system',
})

db.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
})