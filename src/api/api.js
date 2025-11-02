// src/api/api.js
require('dotenv').config();
const express = require('express');

const { createUser, usernameTaken, verifyUser, dbPing, hashWord } = require('./password_storage.js');
const { addQuestion, vote, answerQuestion, topQuestions } = require('./questions.js');
const { sessionMiddleware, requireAuth, getSessionUser, setSessionUser, destroySession} = require('./session.js');
const cors = require('cors');


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(sessionMiddleware());



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
    console.log('login succesful');
    res.status(201).json(result);
  } catch (e) {
    console.log('account create failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
});

// login (optional)
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

    // // jwt token generation
    // const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });

    //create/rotate server session from express-mysql-backend
    req.session.regenerate(err => {
      if(err) {
        console.error('session regen failed', err);
        return res.status(500).json({ error : 'Session error, whoops'});
      }
    });
    //store non-private user session info (email)
    setSessionUser(req, {email});

    console.log("login successful");
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error, whoops' });
  }
});

//* example protected route
// app.get('/api/me', (req, res) => {
//   const token = req.cookies['jwt'];
//   if (!token) return res.status(401).json({ error: 'Not logged in' });

//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     res.json({ ok: true, email: payload.email });
//   } catch (e) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// });
app.get('/api/me', (req, res) => {
  const user = getSessionUser(req);
  if(!user){
    return res.status(401).json({ error: 'Not logged in' })
  };
    res.json({ ok:true, user});
});

app.post('/api/logout', async (req, res) => {
  await destroySession(req);

  res.clearCookie(process.env.SESSION_COOKIE_NAME || 'sid');
  res.json({ ok: true});
});

app.get('/api/private/data', requireAuth,(req, res) => {
  const user = getSessionUser(req);
  res.json({ message: `welcome, ${user.username || 'user'}!`, user: getSessionUser(req)});
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on :${PORT}`);
});
