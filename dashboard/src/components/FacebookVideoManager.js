import React, { useState, useEffect } from 'react';

const FacebookVideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [interval, setInterval] = useState(1);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/facebook/monitor-posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Error fetching videos');
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreatePost = async () => {
    try {
      const response = await fetch('/api/facebook/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating post:', errorData);
        throw new Error('Error creating post');
      }

      fetchVideos();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error creating post');
    }
  };

  const handleSchedulePost = async () => {
    try {
      const response = await fetch('/api/facebook/schedule-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl, description, interval }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error scheduling post:', errorData);
        throw new Error('Error scheduling post');
      }

      fetchVideos();
    } catch (error) {
      console.error('Error scheduling post:', error);
      setError('Error scheduling post');
    }
  };

  return (
    <div>
      <h2>Facebook Video Manager</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Interval (days)"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        />
        <button onClick={handleCreatePost}>Create Post</button>
        <button onClick={handleSchedulePost}>Schedule Post</button>
      </div>
      <h3>Scheduled Videos</h3>
      <table>
        <thead>
          <tr>
            <th>Video URL</th>
            <th>Description</th>
            <th>Interval</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={index}>
              <td>{video.url}</td>
              <td>{video.description}</td>
              <td>{video.interval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacebookVideoManager;
