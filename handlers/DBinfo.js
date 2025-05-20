const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: 'capstone2025.cn4owaaswe8j.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'capstone2025',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;