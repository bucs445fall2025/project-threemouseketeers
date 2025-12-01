// src/api/api.js
require('dotenv').config();
const express = require('express');

const { createUser, usernameTaken, verifyUser, dbPing, hashWord, fetchUsername, fetchUserbyUID, fetchUserbyEmail, createEmailToken, consumeEmailToken, verifyAccountEmail, deleteUser } = require('./password_storage.js');
const { addQuestion, vote, answerQuestion, topQuestions, getAllQuestions, searchQuestions, getQuestionsByTopic } = require('./questions.js');
const { getBio, setBio } = require('./user_bio.js');
const { sessionMiddleware, requireAuth, getSessionUser, setSessionUser, destroySession} = require('./session.js');
const { sendAccountEmail, xorEncrypt } = require('./mail.js');
const { UserDTO } = require('./user_dto');


const cors = require('cors');

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


app.post('/api/verify-email', async (req, res) =>{
  console.log('verify email called');
  //first, ensure user is signed in
  const uid = getSessionUser(req);
  console.log(`uid is ${uid}`);
  if(!uid){
    return res.status(401).json({ error: 'Not logged in' });
  };
  //then, get the current users email address
  const user = await fetchUserbyUID(uid);
  email = user.email
  username = user.username

  try {

    const token = await createEmailToken(uid);

    const link = `http://localhost:5173/api/verify-email?token=${token}`

    await sendAccountEmail({
      address: email,
      link: link,
    });
    
    return res.json({ ok: true });
  }
  catch (e){
    console.error('verify-email error', e);
    return res.status(500).json({ error: 'Could not send verification email' });
  }
});

app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const uid = await consumeEmailToken(token);
    if (!uid) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // mark user as verified
    // await db.query(
    //   'UPDATE users SET email_verified = 1 WHERE id = ?',
    //   [userId]
    // ); 
    //we do this in password_storage now
    verifyAccountEmail(uid);

    console.log(`account ${uid} verified!`);
    return res.redirect(`http://localhost:5173/profile`)
    // return res.json({ ok: true });

  } catch (e) {
    console.error('confirm verify-email error', e);
    return res.status(500).json({ error: 'Internal error' });
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

app.delete('/api/deleteaccount', requireAuth, async (req, res) => {
  try {
    const userId = getSessionUser(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    await deleteUser(userId);

    // Destroy session to log them out
    await destroySession(req);

    return res.status(200).json({ success: true, message: 'Account deleted and logged out' });
  } catch (err) {
    console.error('Error deleting account:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/private/data', requireAuth, async (req, res) => {
  const uid = getSessionUser(req);
  const user = await fetchUserbyUID(uid);
  res.json({ message: `welcome, ${user?.username || 'user'}!`, user});
});

app.get('/api/allquestions', async (req, res) => {
  console.log("Get all questions requested from API");

  const allQuestionsResult = await getAllQuestions(1);

  res.json({ ok: true, allQuestionsResult});
});

app.post('/api/askquestion', async (req, res) => {
  console.log("Ask a question requested of API");

  try {
    const { username, question, topic_id } = req.body || {};
    if (!username || !question || !topic_id) {
      console.log('username or question text missing');
      return res.status(400).json({ error: 'username and question body required' });
    }

    console.log("asking question with username ", username, " and question text ", question);

    const result = await addQuestion(question, username, topic_id);
    console.log('Ask question succesful');
    return res.status(201).json(result);
  } catch (e) {
    console.log('ask question failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
})

app.post('/api/answerquestion', async (req, res) => {
  console.log("Answer question requested of API");

  try {
    const { username, questionID, answer } = req.body || {};
    if (!username || !questionID || !answer) {
      console.log('username or question ID or answer text missing');
      return res.status(400).json({ error: 'username and question ID and answer text required' });
    }

    const result = await answerQuestion(questionID, answer, username);
    console.log('Answer question succesful');
    return res.status(201).json(result);
  } catch (e) {
    console.log('answer question failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
})

app.post('/api/voteanswer', async (req, res) => {
  try {
    const { answerId } = req.body || {};
    if (!answerId) {
      console.log('answer ID missing');
      return res.status(400).json({ error: 'answer ID required' });
    }

    const result = await vote(answerId);
    console.log('Vote for answer succesful');
    return res.status(201).json(result);
  } catch (e) {
     console.log('vote for answer failed');
    return res.status(e.status || 500).json({ error: e.message || 'Internal error, whoops' });
  }
})

app.post('/api/searchquestions', async (req, res) => {
  console.log("Search questions requested");

  try {
    const { query } = req.body || {};
    if (!query) {
      console.log("search query missing");
      return res.status(400).json({ error: "Search query required" });
    }

    const results = await searchQuestions(query);
    console.log("Search successful");

    return res.status(200).json({ ok: true, results });

  } catch (e) {
    console.log("Search failed:", e);
    return res.status(500).json({ error: e.message || "Internal error" });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on :${PORT}`);
});
