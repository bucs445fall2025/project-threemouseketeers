// session.js for creating medthods to preserve user login state
require('dotenv').config();

const session = require ('express-session');
const MySQLStoreFactory = require ('express-mysql-session');

/**
 * @brief Creates and configures the Express session middleware using a MySQL-backed session store.
 *
 * This function initializes a MySQL session store (via express-mysql-session)
 * and returns a fully configured Express session middleware. The session data
 * is persisted in a MySQL database, with automatic table creation and periodic
 * cleanup of expired sessions. Cookie behavior, expiration, and security settings
 * are all controlled via environment variables with sensible fallbacks.
 *
 * Environment variables used:
 * - DB_HOST: MySQL host (default: "db")
 * - DB_PORT: MySQL port (default: 3306)
 * - MYSQL_USER: MySQL username
 * - MYSQL_PASSWORD: MySQL password
 * - MYSQL_DATABASE: Database used for storing sessions (default: "projectdb")
 * - SESSION_COOKIE_NAME: Name of the session cookie (default: "sid")
 * - SESSION_SECRET: Secret key for signing the session ID cookie
 *
 * @return {Function} Configured Express middleware that manages user sessions.
 */
function sessionMiddleware() {
    const MySQLStore = MySQLStoreFactory(session);

    const store = new MySQLStore({
        host: process.env.DB_HOST || 'db',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'projectdb',
        clearExpired: true,
        checkExpirationInterval: 1000 * 60 * 10, //check expiration every 10 mins
        expiration: 1000 * 60 * 30, // expire every 30 mins
        createDatabaseTable: true
    });

    return session ({
        store,
        name: process.env.SESSION_COOKIE_NAME || 'sid',
        secret: process.env.SESSION_SECRET || 'super-secret-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false, //CHANGE THIS FOR PRODUCTION
            sameSite: 'lax',
            maxAge: 1000 * 60 * 30  //30 mins

        }
    });
}

//require user to be logged in
function requireAuth(req, res, next) {
    if(req.session && req.session.uid) return next();
    return res.status(401).json({ error: 'Not logged in!'});
}

// set user on current session using their uid
function setSessionUser(req, uid) {
    req.session.uid = uid;
    console.log(`user id is: ${req.session.uid}`);
}

//get current user's uid
function getSessionUser(req) {
    return req.session ? (req.session.uid || null) : null;
}

function destroySession(req) {
    return new Promise((resolve) => {
        if(!req.session) return resolve();
        req.session.destroy(() => resolve ());
    });
}

module.exports = {
    sessionMiddleware,
    requireAuth,
    getSessionUser,
    setSessionUser,
    destroySession
};