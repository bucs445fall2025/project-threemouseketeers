// src/api/api.js
require('dotenv').config();
const express = require('express');
const { createUser, usernameTaken, verifyUser, dbPing } = require('./password_storage.js');
const { addQuestion, vote, answerQuestion, topQuestions } = require('./questions.js');

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT || 8080);
const API_KEY = process.env.API_KEY || null;

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
      return res.status(400).json({ error: 'username, email, password required' });
    }
    const result = await createUser({ username, email, password });
    res.status(201).json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Internal error' });
  }
});

// login (optional)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    const ok = await verifyUser({ username, password });
    return ok ? res.json({ ok: true }) : res.status(401).json({ ok: false, error: 'Invalid credentials' });
  } catch (e) {
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge listening on :${PORT}`);
});
