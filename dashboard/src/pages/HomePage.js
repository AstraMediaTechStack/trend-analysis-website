import React, { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import piedata from '../piedata.json';
import linedata from '../linedata.json';
import '../styles.css';

const HomePage = () => {
  const [pieData, setPieData] = useState(null);
  const [lineData, setLineData] = useState(null);

  useEffect(() => {
    setPieData({
      labels: piedata.relatedQueries.map(item => item.query),
      datasets: [
        {
          label: 'Related Queries',
          data: piedata.relatedQueries.map(item => item.value),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
        }
      ]
    });

    setLineData({
      labels: linedata.interestOverTime.map(item => item.time),
      datasets: [
        {
          label: 'Interest Over Time',
          data: linedata.interestOverTime.map(item => item.value),
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    });
  }, []);

  return (
    <div>
      <div className='margdiv'>
        <h1>Welcome to the Dashboard</h1>
            </div>
      
      <div className="card">
        <h2>General Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon">📅</div>
            <div>
              <p>Bookings</p>
              <h4>281</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon">💰</div>
            <div>
              <p>Revenue</p>
              <h4>34k</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon">👤</div>
            <div>
              <p>Today's Users</p>
              <h4>2,300</h4>
            </div>
          </div>
          <div className="stat-card">
            <div className="icon">👥</div>
            <div>
              <p>Followers</p>
              <h4>+91</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-container1">
        <div className="mini-container">
          <div className="card1m">
            <h2>Computer Science Trend Over Time</h2>
            {lineData && <Line data={lineData} />}
          </div>
          <div className="card1m">
            <h2>Computer Science Trend Over Time</h2>
            {lineData && <Line data={lineData} />}
          </div>
        </div>
      
        <div className="mini-container">
          <div className="card1m">
            <h2>Computer Science Related Queries</h2>
            {pieData && <Pie data={pieData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
