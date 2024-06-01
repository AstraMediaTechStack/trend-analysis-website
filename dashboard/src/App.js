import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import KeywordPage from './pages/KeywordPage';
import YoutubeMetadataUpdaterPage from './pages/YoutubeMetadataUpdaterPage';
import YoutubeTopTrendsPage from './pages/YoutubeTopTrendsPage';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Sidebar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/keywords" element={<KeywordPage />} />
            <Route path="/youtube-metadata" element={<YoutubeMetadataUpdaterPage />} />
            <Route path="/youtube-trends" element={<YoutubeTopTrendsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
