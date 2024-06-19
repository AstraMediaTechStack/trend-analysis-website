const { google } = require('googleapis');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../tokens.db');
const db = new sqlite3.Database(dbPath);

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const updateVideoMetadata = async (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(400).send('Username is required');
  }

  // Retrieve tokens from SQLite database
  db.get("SELECT tokens FROM tokens WHERE username = ?", [username], async (err, row) => {
    if (err) {
      console.error('Error retrieving tokens:', err);
      return res.status(500).send('Error retrieving authentication tokens');
    }
    if (!row) {
      return res.status(401).send('Not authenticated');
    }
    const tokens = JSON.parse(row.tokens);
    oauth2Client.setCredentials(tokens);

    const updates = req.body.updates; // Array of video updates
    const results = [];

    for (const update of updates) {
      const { videoId, title, description, tags, categoryId } = update;

      try {
        const response = await youtube.videos.update({
          part: 'snippet',
          requestBody: {
            id: videoId,
            snippet: {
              title,
              description,
              tags: tags.split(',').map(tag => tag.trim()), // Convert tags string to array
              categoryId: categoryId.toString(), // Convert categoryId to string if necessary
            },
          },
        });
        results.push({ videoId, status: 'success', details: 'Metadata updated successfully' });
      } catch (error) {
        console.error(`Error updating video ID ${videoId}:`, error.message);
        results.push({ videoId, status: 'failed', details: error.message });
      }
    }

    res.json({ updateResults: results });
  });
};

module.exports = { updateVideoMetadata };
