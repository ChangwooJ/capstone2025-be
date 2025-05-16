const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: 'capstone2025.cn4owaaswe8j.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'capstone2025',
  port: 3306
});


// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '1111',
//   database: 'capstone2025',
//   port: 3306
// });

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = db;