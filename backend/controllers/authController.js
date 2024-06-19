const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

// Start OAuth2 flow
router.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.json({ authUrl });
});

// OAuth2 callback
router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send(`<script>window.opener.postMessage(${JSON.stringify(tokens)}, "*"); window.close();</script>`);
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
