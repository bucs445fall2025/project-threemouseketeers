require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;


const pool = mysql.createPool({
  host: DB_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getBio(email) {
	//retrieve user bio
    const [results] = await pool.execute(
        'SELECT bio FROM users WHERE email = ?',
        [email]
    )
    userBio = results[0].bio;
    
    return userBio;
}

async function setBio({email, newBio}) {
    //update user bio
    const [update] = await pool.execute(
        'UPDATE users SET bio = ? WHERE email = ?',
        [newBio, email]
    )

	return true;
}

module.exports = { getBio, setBio };