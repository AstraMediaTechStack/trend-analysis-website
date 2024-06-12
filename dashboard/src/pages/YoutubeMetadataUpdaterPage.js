import React, { useState } from 'react';

const YoutubeMetadataUpdater = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [updateResults, setUpdateResults] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/youtube/metadata', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUpdateResults(data.updateResults);
  };

  return (
    <div>
      <h2>Upload CSV File to Update YouTube Metadata</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {updateResults.length > 0 && (
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
      )}
    </div>
  );
};

export default YoutubeMetadataUpdater;
