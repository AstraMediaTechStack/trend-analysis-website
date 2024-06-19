const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const router = express.Router();
const dbPath = path.join(__dirname, '../tokens.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

// Start OAuth2 flow
router.get('/auth', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).send('Username is required');
  }
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: username, // Pass username as state parameter
  });
  res.json({ authUrl });
});

// OAuth2 callback
router.get('/oauth2callback', async (req, res) => {
  const { code, state } = req.query;
  const username = state;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the tokens in the SQLite database
    db.run("INSERT OR REPLACE INTO tokens (username, tokens) VALUES (?, ?)", [username, JSON.stringify(tokens)], (err) => {
      if (err) {
        console.error('Error storing tokens:', err);
        return res.status(500).send('Error storing authentication tokens');
      }
      res.send('<script>window.close();</script>'); // Close the popup window after authentication
    });
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
