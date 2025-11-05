// src/api/api.js
require('dotenv').config();
const express = require('express');

const { createUser, usernameTaken, verifyUser, dbPing, hashWord, fetchUsername, fetchUserbyUID, fetchUserbyEmail} = require('./password_storage.js');
const { addQuestion, vote, answerQuestion, topQuestions } = require('./questions.js');
const { getBio, setBio } = require('./user_bio.js');
const { sessionMiddleware, requireAuth, getSessionUser, setSessionUser, destroySession} = require('./session.js');
const cors = require('cors');
const { UserDTO } = require('./user_dto');


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(sessionMiddleware());
app.set('etag', false);





const PORT = Number(process.env.PORT || 8080);
const API_KEY = process.env.API_KEY || null;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // TODO: Fix these


// optional: simple API key gate
app.use((req, res, next) => {
  if (!API_KEY) return next();
  if (req.header('x-api-key') === API_KEY) return next();
  return res.status(401).json({ error: 'Unauthorized' });
});

// health
app.get('/health', async (_req, res) => {
  try {
    await dbPing(); //pings database, returns 500 if can't connect to backend
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// create user
app.post('/api/signup', async (req, res) => { 
  console.log('account create requested');
  try {
    const { username, email, password } = req.body || {};
    if (!email || !password) {
      console.log('email or password missing');
      return res.status(400).json({ error: 'username, email, password required' });
    }
    const result = await createUser({ username, email, password });
    console.log('account create succesful');
    
    // TODO: Break following code (repeated in create-user) into function?
    const user = await fetchUserbyEmail(email);  //gets the userDTO so we can hydrate user info later
    
    //create/rotate server session from express-mysql-backend
    req.session.regenerate(err => {
      if(err) {
        console.error('session regen failed', err);
        return res.status(500).json({ error : 'Session error, whoops'});
      }

      // store minimal, non-sensitive info on the new session
      setSessionUser(req, user.id);
      // ensure the store writes the session before responding
      req.session.save(saveErr => {
        if (saveErr) {
          console.error('session save failed', saveErr);
          return res.status(500).json({ error: 'Session save error' });
        }
        console.log('signup + login successful');
        return res.json({ ok: true });
      });
    });
  } catch (e) {
    console.log('account create failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
});

// login
app.post('/api/login', async (req, res) => {
  console.log('login requested');
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }
    const ok = await verifyUser({ email, password });
    if (!ok) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }
    const user = await fetchUserbyEmail(email);  //gets the userDTO so we can hydrate user info later

    //create/rotate server session from express-mysql-backend
    req.session.regenerate(err => {
      if(err) {
        console.error('session regen failed', err);
        return res.status(500).json({ error : 'Session error, whoops'});
      }

      // store minimal, non-sensitive info on the new session
      setSessionUser(req, user.id);
      // ensure the store writes the session before responding
      req.session.save(saveErr => {
        if (saveErr) {
          console.error('session save failed', saveErr);
          return res.status(500).json({ error: 'Session save error' });
        }
        console.log('login successful');
        return res.json({ ok: true });
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error, whoops' });
  }
});

//fetch user bio
app.post('/api/fetchbio', async (req, res) =>{
  console.log('get bio requested');
  try {
    const { username } = req.body || {};
    if (!username) {
      console.log('username missing');
      return res.status(400).json({ error: 'username required' });
    }
    const result = await getBio({ username });
    console.log('get bio succesful');
    return res.status(201).json(result);
  } catch (e) {
    console.log('get bio failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
});

//update user bio
app.post('/api/updatebio', async (req, res) =>{
  console.log('update bio requested');
  try {
    const { username, newBio } = req.body || {};
    if (!username || !newBio) {
      console.log('username or new bio missing');
      return res.status(400).json({ error: 'username and new bio required' });
    }
    const result = await setBio({ username, newBio });
    console.log('update bio succesful');
    return res.status(201).json(result);
  } catch (e) {
    console.log('update bio failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
});


app.get('/api/me', async (req, res) => {
  console.log(`api/me called`)
  const uid = getSessionUser(req);
  if(!uid){
    return res.status(401).json({ error: 'Not logged in' })
  };
  const user = await fetchUserbyUID(uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  //disable caching for identity cookies
  res.set('Cache-Control', 'no-store');
  res.set('Vary', 'Cookie');

  res.json({ ok:true, user});
});

app.post('/api/logout', async (req, res) => {
  console.log("api/logout called")
  await destroySession(req);

  res.clearCookie(process.env.SESSION_COOKIE_NAME || 'sid');
  res.json({ ok: true});
});

app.get('/api/private/data', requireAuth, async (req, res) => {
  const uid = getSessionUser(req);
  const user = await fetchUserbyUID(uid);
  res.json({ message: `welcome, ${user?.username || 'user'}!`, user});
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on :${PORT}`);
});
