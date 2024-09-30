const axios = require('axios');
const schedule = require('node-schedule');

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID; // Replace with your Facebook page ID

// Function to create/copy a video post
exports.createPost = async (req, res) => {
  const { videoUrl, description } = req.body;
  console.log('createPost - videoUrl:', videoUrl, 'description:', description);

  if (!videoUrl || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${PAGE_ID}/videos`,
      {
        file_url: videoUrl,
        description: description,
        access_token: FACEBOOK_ACCESS_TOKEN,
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to schedule a video post
exports.schedulePost = (req, res) => {
  const { videoUrl, description, interval } = req.body;
  console.log('schedulePost - videoUrl:', videoUrl, 'description:', description, 'interval:', interval);

  if (!videoUrl || !description || !interval) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    schedule.scheduleJob(`*/${interval} * * * *`, async () => {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/v12.0/${PAGE_ID}/videos`,
          {
            file_url: videoUrl,
            description: description,
            access_token: FACEBOOK_ACCESS_TOKEN,
          }
        );
        console.log('Scheduled post created:', response.data);
      } catch (error) {
        console.error('Error creating scheduled post:', error.response ? error.response.data : error.message);
      }
    });
    res.status(200).json({ message: 'Post scheduled successfully' });
  } catch (error) {
    console.error('Error scheduling post:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Function to monitor scheduled posts
exports.monitorPosts = (req, res) => {
  // Implement logic to fetch and monitor scheduled posts
  res.status(200).json({ message: 'Monitoring posts' });
};
