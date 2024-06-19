import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom';

const YoutubeMetadataUpdater = () => {
  const [file, setFile] = useState(null);
  const [updateResults, setUpdateResults] = useState([]);
  const [username, setUsername] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [location]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAuth = async () => {
    if (!username) {
      console.error('Username is required.');
      return;
    }

    const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://trend-analysis-website-server.vercel.app';

    try {
      const response = await fetch(`${baseUrl}/api/auth/auth?username=${username}`);
      const data = await response.json();
      setAuthUrl(data.authUrl);

      // Open the authentication URL in a popup window
      const authWindow = window.open(data.authUrl, '_blank', 'width=500,height=600');

      // Poll the popup window to detect when it closes
      const pollTimer = window.setInterval(() => {
        if (authWindow.closed) {
          window.clearInterval(pollTimer);
          // Reload or re-fetch tokens here
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('Error initiating authentication:', error);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    if (!username) {
      console.error('Username is required.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://trend-analysis-website-server.vercel.app';

      try {
        const response = await fetch(`${baseUrl}/api/youtube/update-metadata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, updates: jsonData }),
        });

        if (response.status === 401) {
          // Prompt for authentication
          handleAuth();
          return;
        }

        const result = await response.json();
        setUpdateResults(result.updateResults);
      } catch (error) {
        console.error('Error updating metadata:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>YouTube Metadata Updater</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSubmit}>Update Metadata</button>
        {authUrl && (
          <div>
            <h3>Authentication Required</h3>
            <p>Please complete the authentication process in the popup window.</p>
          </div>
        )}
        <div>
          <h3>Update Results</h3>
          <table>
            <thead>
              <tr>
                <th>Video ID</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {updateResults.map((result, index) => (
                <tr key={index}>
                  <td>{result.videoId}</td>
                  <td>{result.status}</td>
                  <td>{result.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default YoutubeMetadataUpdater;
