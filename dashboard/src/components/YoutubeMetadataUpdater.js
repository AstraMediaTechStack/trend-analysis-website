import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const YoutubeMetadataUpdater = () => {
  const [file, setFile] = useState(null);
  const [updateResults, setUpdateResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const baseUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://trend-analysis-website-server.vercel.app";
      
      try {
        const response = await fetch(`${baseUrl}/api/youtube/update-metadata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jsonData),
        });

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
        <button onClick={handleSubmit}>Update Metadata</button>
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
