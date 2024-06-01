import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordTrendAnalyzer from './components/KeywordTrendAnalyzer';
import YoutubeMetadataUpdater from './components/YoutubeMetadataUpdater';
import YoutubeTopTrends from './components/YoutubeTopTrends';
import Sidebar from './components/Sidebar';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/keywords" element={<KeywordTrendAnalyzer />} />
            <Route path="/youtube-metadata" element={<YoutubeMetadataUpdater />} />
            <Route path="/youtube-trends" element={<YoutubeTopTrends />} />
            <Route path="/" element={<h1>Welcome to the Dashboard</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
