const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(process.cwd(), 'tokens.json');
let tokens;

if (fs.existsSync(TOKEN_PATH)) {
  tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
}

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID, 
  process.env.CLIENT_SECRET, 
  process.env.REDIRECT_URI 
);

if (tokens) {
  oauth2Client.setCredentials(tokens);
}

const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

const updateVideoMetadata = async (req, res) => {
  const updates = req.body; // Array of video updates
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
};

module.exports = { updateVideoMetadata };
