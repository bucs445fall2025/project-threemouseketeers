require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE;

// for database queries 
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

/**
 * @brief Retrieves the bio text for a given user
 *
 * This function queries the `users` table to fetch the `bio` field
 * associated with the provided username. If no matching user record is found,
 * an error is thrown.
 *
 * @param {string} username The username whose bio should be retrieved
 *
 * @returns An object containing the user's bio
 * @throws 500 If the user does not exist or no bio is found
 */
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

/**
 * @brief Updates the bio text for a given user
 *
 * This function writes a new `bio` value into the `users` table for
 * the specified username. If no rows are modified—indicating a missing user
 * or failure to update—an error is thrown.
 *
 * @param {string} username The username whose bio is being updated.
 * @param {string} newBio The new bio content to store.
 *
 * @returns An object containing the updated bio text
 * @throws 500 if the update fails or the user cannot be found.
 */
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