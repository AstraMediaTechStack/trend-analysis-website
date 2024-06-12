const { google } = require('googleapis');
const express = require('express');
const opn = require('opn'); // Using opn instead of open
const fs = require('fs');
const path = require('path');

const app = express();
const oauth2Client = new google.auth.OAuth2(
  '848413688937-pohc1351nevlmh0qha0t3uto4j7hu2k6.apps.googleusercontent.com',
  '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',
  'http://localhost:5000/oauth2callback'
);

const SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl'];

app.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  opn(authUrl);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  fs.writeFileSync('tokens.json', JSON.stringify(tokens));
  res.send('Authentication successful! You can close this tab.');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  console.log('Visit http://localhost:5000/auth to start the authentication process.');
});
