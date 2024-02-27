const dotenv = require('dotenv');

dotenv.config({ path: './.env'});

const mysql = require('mysql');

const connectDB = ()=> {
  const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE1
  });

  return db;
}

module.exports = {
    connectDB
}