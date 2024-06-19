const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const router = express.Router();
const TOKEN_PATH = path.join(__dirname, '../tokens.json');

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

    // Read existing tokens
    let tokenData = {};
    if (fs.existsSync(TOKEN_PATH)) {
      tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH));
    }

    // Store the tokens in the tokens.json file
    tokenData[username] = tokens;
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData));

    // Send a success response or redirect to a success page
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
