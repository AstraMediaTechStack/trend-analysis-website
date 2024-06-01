import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/keywords">Keyword Analysis</Link></li>
        <li><Link to="/youtube-metadata">YouTube Metadata Updater</Link></li>
        <li><Link to="/youtube-trends">YouTube Top Trends</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
