import React, { useState, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
import '../styles.css';
Chart.register(...registerables);

const YoutubeTopTrends = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const fetchTrendingVideos = async () => {
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
  };

  const createCharts = (videos) => {
    const labels = videos.map(video => video.title);
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

  return (
    <div className="container">
      <div className="main-content">
        <div className="card">
          <h2>Top 10 Trending YouTube Videos</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <canvas id="viewCountChart"></canvas>
            </div>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <canvas id="likeCountChart"></canvas>
            </div>
          </div>
          <div>
            <h3>Trending Videos Data</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Upload Date</th>
                  <th>Thumbnail</th> {/* New column for thumbnails */}
                  <th>Description</th> {/* New column for description */}
                  <th>Video Link</th> {/* New column for video link */}
                </tr>
              </thead>
              <tbody>
                {videos.length > 0 ? videos.map((video, index) => (
                  <tr key={index}>
                    <td>{video.title}</td>
                    <td>{video.channel}</td>
                    <td>{video.viewCount}</td>
                    <td>{video.likeCount}</td>
                    <td>{video.commentCount}</td>
                    <td>{new Date(video.uploadDate).toLocaleDateString()}</td>
                    <td><img src={`https://img.youtube.com/vi/${video.videoId}/default.jpg`} alt={`${video.title} thumbnail`} /></td> {/* Display thumbnail */}
                    <td>{video.description}</td> {/* Display description */}
                    <td><a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">Watch Video</a></td> {/* Display video link */}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9">Loading...</td> {/* Adjust colspan for the new columns */}
                  </tr>
                )}
              </tbody>
            </table>
            <button onClick={() => exportToExcel(videos, 'trending_videos.xlsx')}>Export as XLSX</button>
            <button onClick={() => exportToExcel(videos, 'trending_videos.csv')}>Export as CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeTopTrends;
