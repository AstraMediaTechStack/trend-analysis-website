const { google } = require('googleapis');
const youtube = google.youtube('v3');

module.exports.getTrendingVideos = async (req, res) => {
  try {
    const response = await youtube.videos.list({
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: 'US', // Change this to the desired region
      maxResults: 10,
      key: process.env.GOOGLE_API_KEY

    });

    const videos = response.data.items.map(video => ({
      title: video.snippet.title,
      channel: video.snippet.channelTitle,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      commentCount: video.statistics.commentCount,
      uploadDate: video.snippet.publishedAt,
      videoId: video.id
    }));

    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching trending videos:', error);
    res.status(500).json({ error: 'Failed to fetch trending videos' });
  }
};
