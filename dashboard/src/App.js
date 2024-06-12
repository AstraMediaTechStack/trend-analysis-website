import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordTrendAnalyzer from './components/KeywordTrendAnalyzer';
import YoutubeMetadataUpdater from './components/YoutubeMetadataUpdater';
import YoutubeTopTrendsPage from './pages/YoutubeTopTrendsPage';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';

import './styles.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/keywords" element={<KeywordTrendAnalyzer />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/youtube-trends" element={<YoutubeTopTrendsPage />} />
            <Route path="/youtube-metadata" element={<YoutubeMetadataUpdater />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
