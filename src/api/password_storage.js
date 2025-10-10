require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const dbHost = process.env.DB_HOST;
const dbUser = process.env.MYSQL_USER;
const dbPassword = process.env.MYSQL_PASSWORD;
const dbDatabase = process.env.MYSQL_DATABASE;

//Connect to MySQL database
const connection = mysql.createConnection({
	host: dbHost,
	user: dbUser,
	password: dbPassword,
	database: dbDatabase,
	port: 3306
});

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to MySQL:', err.stack);
		console.log('! Error connecting to MySQL:', err.stack);
		return;
	}
	console.log('Connected to MySQL as id ' + connection.threadId);
});

connection.query("USE projectdb", function (err, result) {
	if(err) {
		console.error('Error using projectdb.');
		return;
	}
});

//Try creating new user
const test_username = 'TestUser15';
const test_email = 'test15@test.edu';
const test_pw = 'hunter2';
const saltRounds = 10;

//check users table for existing user with this username
connection.query("SELECT * FROM users WHERE username = ?", [test_username], function (err, result) {
	if(err) {
		console.error('Error checking for existing user.');
		return;
	}
	if(result.length) {
		console.log('Username already exists in db!');
		console.log(result);
		return;
	}
	console.log('User does not exist. Attempting to create user...')
});

console.log("Hashing password...");
console.log("Plaintext password: " + test_pw);

//hash the password and insert into users table
const test_pw_hash = bcrypt.hash(test_pw, saltRounds, function(err, hash) {
	if (err) {
		console.error('Error hashing plaintext password.');
		return;
	}
	console.log('Password hashed successfully.');
	console.log('Hashed password: ' + hash);
	
	//verify hashed password matches plaintext password
	bcrypt.compare(test_pw, hash, function(err,success) {
		if (err) {
			console.error('Initial password compare failed.');
			return;
		}
		if (success) {
			console.log('Plaintext and hashed passwords match.');
		} else {
			console.log('Plaintext and hashed passwords do not match');
		}
	});
	
	const create = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
	const create_values = [test_username, test_email, hash];

	connection.query(create, create_values, function (err, result) {
		console.log("Attempting to insert row:");
		console.log(test_username, test_email, hash);
		if (err) {
			console.error('Error creating user in MySQL database.');
			return;
		}
		console.log("1 record inserted, ID: " + result.insertId);
	});
	
	//Verify username and password are stored correctly
	const validate_2 = "SELECT password_hash FROM users WHERE username = ?";
	const validate_2_values = [test_username];
	connection.query(validate_2, validate_2_values, function (err,found_hash) {
		if (err) {
			console.error('Error verifying username and password.');
			return;
		}
		if(!found_hash) {
			console.log('Could not find hashed password.');
			return;
		}
		console.log("Hashed password for user " + test_username + " retrieved.");
		console.log("Checking plaintext password " + test_pw);
		//console.log("Against hashed password " + found_hash); //why is this undefined?
		console.log("Against hashed password " + found_hash[0].password_hash);
		
		bcrypt.compare(test_pw, found_hash[0].password_hash, function(err, success) {
			if(err) {
				console.error("Database password compare failed.");
				return;
			}
			if(success) {
				console.log("Plaintext password matches database hash.");
			} else {
				console.log("Plaintext password does not match database hash.");
			}
		});
	});
	
	/*connection.end(err => {
		if(err) {
			console.error('Error closing MySQL connection: ', err.stack);
			return;
		}
		console.log('Closed connection to MySQL.');
	});*/
});