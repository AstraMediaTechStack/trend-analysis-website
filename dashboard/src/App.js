import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import KeywordTrendAnalyzer from './components/KeywordTrendAnalyzer';
// import YoutubeMetadataUpdater from './components/YoutubeMetadataUpdater';
// import YoutubeTopTrends from './components/YoutubeTopTrends';
import Sidebar from './components/Sidebar';
import YoutubeTopTrendsPage from './pages/YoutubeTopTrendsPage';

import './styles.css';

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/keywords" element={<KeywordTrendAnalyzer />} />
            <Route path="/" element={<h1>Welcome to the Dashboard</h1>} />  
            <Route path="/youtube-trends" element={<YoutubeTopTrendsPage />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
