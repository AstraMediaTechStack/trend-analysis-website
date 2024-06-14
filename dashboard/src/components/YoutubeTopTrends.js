import React, { useState, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import '../styles.css';
import axios from 'axios'; // Use axios for API calls

Chart.register(...registerables);

const OPENAI_API_KEY ='sk-proj-trPBPFwY0aHrX617jmC5T3BlbkFJEL0hbb742mIVMAkyoFU2';

const generateResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides detailed analyses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('No text generated');
    }
  } catch (error) {
    console.error('Error in generateResponse:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const YoutubeTopTrends = () => {
  const [videos, setVideos] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState('');
  const [edgeDetectedImage, setEdgeDetectedImage] = useState(null);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const fetchTrendingVideos = useCallback(async () => {
    const baseUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://trend-analysis-website-server.vercel.app";
    try {
      const response = await fetch(`${baseUrl}/api/youtube/trending`);
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const data = await response.json();
      if (data.videos) {
        setVideos(data.videos);
        createCharts(data.videos);
      }
    } catch (error) {
      console.error('Error fetching trending videos:', error);
    }
  }, []);

  useEffect(() => {
    fetchTrendingVideos();
  }, [fetchTrendingVideos]);

  const createCharts = (videos) => {
    const labels = videos.map((video, index) => `Video ${index + 1}`);
    const viewCounts = videos.map(video => video.viewCount);
    const likeCounts = videos.map(video => video.likeCount);

    // Bar Chart for View Counts
    const viewCountCtx = document.getElementById('viewCountChart').getContext('2d');
    new Chart(viewCountCtx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'View Count',
          data: viewCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'View Counts of Top 10 Trending Videos'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Pie Chart for Like Counts
    const likeCountCtx = document.getElementById('likeCountChart').getContext('2d');
    new Chart(likeCountCtx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          label: 'Like Count',
          data: likeCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Like Counts of Top 10 Trending Videos'
          }
        }
      }
    });
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  const handleThumbnailSelect = (event) => {
    setSelectedThumbnail(event.target.value);
  };

  const analyzeThumbnail = async () => {
    const baseUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://trend-analysis-website-server.vercel.app";
    try {
      const response = await fetch(`${baseUrl}/api/youtube/analyze-thumbnail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: selectedThumbnail })
      });
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setEdgeDetectedImage(imageUrl);
    } catch (error) {
      console.error('Error performing edge detection:', error);
    }
  };

  const handleQuestionSubmit = async () => {
    const videoTitles = videos.map(video => video.title).join(', ');
    const channelNames = videos.map(video => video.channel).join(', ');
    const videoViews = videos.map(video => video.viewCount).join(', ');
    const videoLikes = videos.map(video => video.likeCount).join(', ');

    const prompt = `
      You have access to the following trending YouTube video data:
      Titles: ${videoTitles}
      Channels: ${channelNames}
      View Counts: ${videoViews}
      Like Counts: ${videoLikes}
      Answer the following question based on this data:
      ${question}
    `;

    try {
      const response = await generateResponse(prompt);
      setAiResponse(response);
    } catch (error) {
      console.error('Error generating response:', error);
      setAiResponse('Failed to generate response.');
    }
  };

  return (
    <div className="container">
      <div className="main-content">
        <div className="card">
          <h2 className="card-title">Top 10 Trending YouTube Videos</h2>
          <div className="charts-container">
            <div className="chart-wrapper">
              <canvas id="viewCountChart"></canvas>
            </div>
            <div className="chart-wrapper">
              <canvas id="likeCountChart"></canvas>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="card-title">Trending Videos Data</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Channel URL</th>
                  <th>Subscribers</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Upload Date</th>
                  <th>Thumbnail</th>
                  <th>Description</th>
                  <th>Tags</th>
                  <th>Category</th>
                  <th>Duration</th>
                  <th>Title Capitalized Words</th>
                  <th>Title Upper Case Count</th>
                  <th>Title Emoji Count</th>
                  <th>Title Character Count</th>
                  <th>Dominant Colors</th>
                  <th>Mood</th>
                  <th>Video Link</th>
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? videos.map((video, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{video.title}</td>
                    <td>{video.channel}</td>
                    <td><a href={video.channelUrl} target="_blank" rel="noopener noreferrer">{video.channelUrl}</a></td>
                    <td>{video.subscriberCount}</td>
                    <td>{video.viewCount}</td>
                    <td>{video.likeCount}</td>
                    <td>{video.commentCount}</td>
                    <td>{new Date(video.uploadDate).toLocaleDateString()}</td>
                    <td>
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/default.jpg`}
                        alt={`${video.title} thumbnail`}
                        onClick={() => setSelectedThumbnail(video.thumbnail)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td>{video.description}</td>
                    <td>{video.tags ? video.tags.join(', ') : 'N/A'}</td>
                    <td>{video.category}</td>
                    <td>{video.duration}</td>
                    <td>{video.titleCapitalizedWords}</td>
                    <td>{video.titleUpperCaseCount}</td>
                    <td>{video.titleEmojiCount}</td>
                    <td>{video.titleCharacterCount}</td>
                    <td>{video.thumbnailAnalysis.dominantColors.join(', ')}</td>
                    <td>{video.mood}</td>
                    <td><a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">Watch Video</a></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="21">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <button onClick={() => exportToExcel(videos, 'trending_videos.xlsx')}>Export as XLSX</button>
            <button onClick={() => exportToExcel(videos, 'trending_videos.csv')}>Export as CSV</button>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Analyze Selected Thumbnail</h2>
          <div>
            <select onChange={handleThumbnailSelect} value={selectedThumbnail}>
              <option value="">Select a thumbnail</option>
              {videos.map((video, index) => (
                <option key={index} value={video.thumbnail}>{video.title}</option>
              ))}
            </select>
            <button onClick={analyzeThumbnail} disabled={!selectedThumbnail}>Analyze Selected Image</button>
          </div>
          {edgeDetectedImage && (
            <div>
              <h3>Edge Detection Result</h3>
              <img src={edgeDetectedImage} alt="Edge Detection Result" />
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="card-title">Ask AI about Trending Videos</h2>
          <div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here"
              className="text-input"
            />
            <button onClick={handleQuestionSubmit} disabled={!question}>Submit</button>
          </div>
          {aiResponse && (
            <div>
              <h3>AI Response</h3>
              <p>{aiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YoutubeTopTrends;
