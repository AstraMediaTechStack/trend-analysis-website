import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.svg'; // Update this path to the actual path of your logo file

const Sidebar = () => {
  return (
    <aside className="sidenav">
      <div className="navbar-header">
        <img src={logo} alt="Astra Media Logo" className="logo" />
        <div className="logo-cont">

        
        <div className="motto">Create. Connect. Captivate.</div>
        </div>
        
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
          <Link to="/login" className="nav-link">Sign In</Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">Sign Up</Link>
        </li>            
        <li className="nav-item">
          <Link to="/facebook-manager" className="nav-link">Facebook Video Manager</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
