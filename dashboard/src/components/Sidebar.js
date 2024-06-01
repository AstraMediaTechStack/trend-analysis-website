import React from 'react';

const Sidebar = () => {
  return (
    <aside>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/keywords">Keyword Analysis</a></li>
        <li><a href="/youtube-metadata">YouTube Metadata Updater</a></li>
        <li><a href="/youtube-trends">YouTube Top Trends</a></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
