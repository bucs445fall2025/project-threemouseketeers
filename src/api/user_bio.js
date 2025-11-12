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

async function getBio({username}) {
	//retrieve user bio
    const [results] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    if (!results.length) {
        const err = new Error('user bio was not found');
		err.status = 500;
		throw err;	
    }

    userBio = results[0].bio;
    return {bio: userBio};
}

async function setBio({username, newBio}) {
    //update user bio
    const [update] = await pool.execute(
        'UPDATE users SET bio = ? WHERE username = ?',
        [newBio, username]
    );
    if(update.affectedRows != 1) {
        const err = new Error('user bio was not updated');
		err.status = 500;
		throw err;	
    }

	return {bio: newBio};
}

module.exports = { getBio, setBio };