const { google } = require('googleapis');
const youtube = google.youtube('v3');
const axios = require('axios');
const getColors = require('get-image-colors');
const Vibrant = require('node-vibrant');

// Helper function to calculate character count
const getCharacterCount = (str) => {
  const count = {};
  for (const char of str) {
    count[char] = count[char] ? count[char] + 1 : 1;
  }
  return JSON.stringify(count); // Convert object to string for rendering
};

// Helper function to count capitalized words
const countCapitalizedWords = (title) => {
  return title.split(' ').filter(word => /^[A-Z]/.test(word)).length;
};

// Helper function to count uppercase letters
const countUpperCase = (title) => {
  return title.split('').filter(char => /[A-Z]/.test(char)).length;
};

// Helper function to count emojis
const countEmojis = (title) => {
  return (title.match(/[\p{Emoji}]/gu) || []).length;
};

// Helper function to analyze the mood of a thumbnail (basic example)
const analyzeMood = (colors) => {
  if (!colors) return 'N/A';
  const colorScores = {
    happy: ['#FFFF00', '#FFD700', '#FFA500'], // yellows and oranges
    sad: ['#0000FF', '#000080', '#1E90FF'], // blues
    angry: ['#FF0000', '#8B0000', '#DC143C'], // reds
  };
  let mood = 'neutral';
  for (const color of colors) {
    for (const [key, values] of Object.entries(colorScores)) {
      if (values.includes(color)) {
        mood = key;
        break;
      }
    }
  }
  return mood;
};

const getDominantColors = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data, 'binary');
    const colors = await getColors(imageBuffer, 'image/jpeg');
    return colors.map(color => color.hex());
  } catch (error) {
    console.error('Error getting dominant colors:', error);
    return [];
  }
};

module.exports.getTrendingVideos = async (req, res) => {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails',
      chart: 'mostPopular',
      regionCode: 'US',
      maxResults: 10,
      key: process.env.GOOGLE_API_KEY
    });

    const videos = await Promise.all(response.data.items.map(async (video) => {
      const channelResponse = await youtube.channels.list({
        part: 'snippet,statistics',
        id: video.snippet.channelId,
        key: process.env.GOOGLE_API_KEY
      });

      const channel = channelResponse.data.items[0];

      const dominantColors = await getDominantColors(video.snippet.thumbnails.default.url);

      return {
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
        subscriberCount: channel.statistics.subscriberCount,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
        uploadDate: video.snippet.publishedAt,
        videoId: video.id,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.default.url,
        tags: video.snippet.tags,
        category: getCategory(video.snippet.categoryId),
        duration: video.contentDetails.duration,
        titleCapitalizedWords: countCapitalizedWords(video.snippet.title),
        titleUpperCaseCount: countUpperCase(video.snippet.title),
        titleEmojiCount: countEmojis(video.snippet.title),
        titleCharacterCount: getCharacterCount(video.snippet.title),
        thumbnailAnalysis: { dominantColors },
        mood: analyzeMood(dominantColors)
      };
    }));

    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
};

// Function to get category name from category ID
const getCategory = (categoryId) => {
  const categories = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism'
  };
  return categories[categoryId] || 'Unknown';
};
