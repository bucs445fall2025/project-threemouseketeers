require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { generateUsername } = require('unique-username-generator')
const { UserDTO } = require('./user_dto');


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



//Try creating new user
const test_username = 'TestUser13';
const test_email = 'test13@test.edu';
const test_pw = 'hunter2';
const saltRounds = 10;

async function usernameTaken(username){
	//check users table for existing user with this username
	const [rows] =  await pool.execute(
		'SELECT id FROM users WHERE username = ?',
		[username]
	);
	return (rows.length > 0);
}

function hashWord(password) {
	return bcrypt.hash(password, Number(saltRounds));
}

async function createUser({username, email, password}) {
	//verify uniqueness first
	const trimmed = typeof username === 'string' ? username.trim() : ''; //handles any type of non-valid username
	username = trimmed;

	if(!username){
		username = generateUsername("",2);
		while (await usernameTaken(username)){
			username = generateUsername("", 2);
		}
	}
	if( await usernameTaken(username)) {  //stops account creation if username is taken
		const err = new Error('username has been taken');
		err.status = 409;
		throw err;		
	}


	//hash the password and insert into users table
	// const hash = await bcrypt.hash(password, Number(saltRounds));
	const hash = await hashWord(password); // hashword returns a promise, need to await it
	const [result] = await pool.execute(
	    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    	[username, email, hash]
  	);

	return {id: result.insertId, username, email};

}
	
async function verifyUser({ email, password }) {
  if (!email || !password) return false;

  const [rows] = await pool.execute(
    'SELECT password_hash FROM users WHERE email = ?',
    [email]
  );

  if (!rows.length) return false;

  const hash = rows[0].password_hash;
  return bcrypt.compare(password, hash);
}

async function dbPing() {
	await pool.query('SELECT 1');
	return true;
}
async function fetchUsername(email){ //this might create some security issues
	const [rows] = await pool.execute(
		'SELECT * FROM users WHERE email = ?',
		[email]
	);
	return rows[0].username;
}

async function fetchUserbyUID(uid){
	const [rows] = await pool.execute(
		'SELECT id, username, email, bio FROM `users` WHERE id = ?',
		[uid]
	);
	const row = rows[0];
	if (!row) return null;
	return{ ...UserDTO, ...row}
}

async function fetchUserbyEmail(email){
	const [rows] = await pool.execute(
	'SELECT id, username, email, bio FROM `users` WHERE email = ?',
	[email]
	);
	const row = rows[0];
	if (!row) return null;
	return{ ...UserDTO, ...row}
}

//this is a testing suite, we should not be hard coding our functions with test variables

async function test(){

}

module.exports = { createUser, usernameTaken, verifyUser, dbPing, hashWord, fetchUsername, fetchUserbyUID, fetchUserbyEmail}; 