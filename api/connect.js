import mysql from "mysql"

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'irb_system',
    port: 3306
})

db.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
})