import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidenav">
      <div className="sidenav-header">
        <h2>Dashboard</h2>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/keywords" className="nav-link">Keyword Analyzer</Link>
        </li>
        <li className="nav-item">
          <Link to="/youtube-trends" className="nav-link">YouTube Trends Analyzer</Link>
        </li>
        <li className="nav-item">
          <Link to="/youtube-metadata" className="nav-link">YouTube Metadata Updater</Link>
        </li>
        <li className="nav-item">
          <h6 className="nav-section-title">ACCOUNT PAGES</h6>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">Profile</Link>
        </li>
        <li className="nav-item">
          <Link to="/sign-in" className="nav-link">Sign In</Link>
        </li>
        <li className="nav-item">
          <Link to="/sign-up" className="nav-link">Sign Up</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
