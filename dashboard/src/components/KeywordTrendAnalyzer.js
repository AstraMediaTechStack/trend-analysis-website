import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import * as XLSX from 'xlsx';
Chart.register(...registerables);

const KeywordTrendAnalyzer = () => {
  const [keywordInput, setKeywordInput] = useState('');
  const [fileKeywords, setFileKeywords] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [descriptions, setDescriptions] = useState({});
  const chartRefs = useRef({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const keywordList = text.split('\n').map(line => line.trim()).filter(line => line);
      setFileKeywords(keywordList);
    };
    reader.readAsText(file);
  };

  const clearCharts = () => {
    Object.values(chartRefs.current).forEach(chart => chart && chart.destroy());
    chartRefs.current = {};
  };

  const handleSubmit = () => {
    let combinedKeywords = [];
    if (keywordInput) {
      combinedKeywords.push(keywordInput.trim());
    }
    combinedKeywords = combinedKeywords.concat(fileKeywords).filter((keyword, index, self) => keyword && self.indexOf(keyword) === index);
    setKeywords(combinedKeywords);
    clearCharts();
    setResults([]);
    setDescriptions({});
  };

  const fetchTrends = async (keyword) => {
    const baseUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://keywordproj.vercel.app";
    try {
      const response = await fetch(`${baseUrl}/keywords/trends?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Log the fetched data
      return { keyword, data };
    } catch (error) {
      console.error('Error:', error);
      return { keyword, data: null };
    }
  };

  const generateDescription = async (keyword, trendData, monthlyAverages) => {
    const baseUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : "https://keywordproj.vercel.app";
    try {
      const response = await fetch(`${baseUrl}/api/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, trendData, monthlyAverages }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data.description;
    } catch (error) {
      console.error('Error generating description:', error);
      return 'Error generating description.';
    }
  };

  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  };

  useEffect(() => {
    const loadData = async () => {
      const results = await Promise.all(keywords.map(keyword => fetchTrends(keyword)));
      setResults(results);

      const descriptions = {};
      for (const result of results) {
        if (result.data) {
          const description = await generateDescription(result.keyword, filterForJanuary(result.data.interestOverTime.default.timelineData), result.data.monthlyAverages);
          descriptions[result.keyword] = description;
        }
      }
      setDescriptions(descriptions);
    };
    if (keywords.length > 0) {
      loadData();
    }
  }, [keywords]);

  useEffect(() => {
    results.forEach(result => {
      console.log('Processing result:', result); // Log the result being processed
      if (result.data) {
        const keyword = result.keyword;
        const lineChartData = result.data.interestOverTime;
        const barChartData = result.data.monthlyAverages;
        const pieChartData = result.data.interestByRegion;

        if (!lineChartData || !barChartData || !pieChartData) {
          console.error(`Missing data for keyword: ${keyword}`);
          return;
        }

        const labels = lineChartData.default.timelineData.map(item => item.formattedAxisTime);
        const values = lineChartData.default.timelineData.map(item => item.value[0]);

        console.log('lineChartData:', lineChartData);
        console.log('barChartData:', barChartData);
        console.log('pieChartData:', pieChartData);

        // Line Chart
        const lineCtx = document.getElementById(`lineChart-${keyword}`);
        if (lineCtx && chartRefs.current[`lineChart-${keyword}`]) {
          chartRefs.current[`lineChart-${keyword}`].destroy();
        }
        if (lineCtx) {
          chartRefs.current[`lineChart-${keyword}`] = new Chart(lineCtx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: 'Trend over Time',
                data: values,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }

        // Bar Chart
        const barCtx = document.getElementById(`barChart-${keyword}`);
        if (barCtx && chartRefs.current[`barChart-${keyword}`]) {
          chartRefs.current[`barChart-${keyword}`].destroy();
        }
        if (barCtx) {
          chartRefs.current[`barChart-${keyword}`] = new Chart(barCtx, {
            type: 'bar',
            data: {
              labels: barChartData.map(item => item.month),
              datasets: [{
                label: 'Average Monthly Trend',
                data: barChartData.map(item => item.average),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }

        // Pie Chart
        const pieCtx = document.getElementById(`pieChart-${keyword}`);
        if (pieCtx && chartRefs.current[`pieChart-${keyword}`]) {
          chartRefs.current[`pieChart-${keyword}`].destroy();
        }
        if (pieCtx) {
          chartRefs.current[`pieChart-${keyword}`] = new Chart(pieCtx, {
            type: 'pie',
            data: {
              labels: pieChartData.default.geoMapData.map(item => item.geoName),
              datasets: [{
                label: 'Trend by Region',
                data: pieChartData.default.geoMapData.map(item => item.value),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            }
          });
        }
      }
    });
  }, [results]);

  const filterForJanuary = (data) => {
    return data.filter(item => item.formattedAxisTime.includes('Jan 1'));
  };

  return (
    <div>
      <div>
        <input 
          type="text" 
          value={keywordInput} 
          onChange={(e) => setKeywordInput(e.target.value)} 
          placeholder="Enter keyword" 
        />
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleFileUpload} 
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      {results.map(result => (
        <div key={result.keyword} style={{ marginBottom: '50px' }}>
          <h2>{result.keyword}</h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <div style={{ width: '30%', marginBottom: '20px' }}>
              <canvas id={`lineChart-${result.keyword}`}></canvas>
            </div>
            <div style={{ width: '30%', marginBottom: '20px' }}>
              <canvas id={`barChart-${result.keyword}`}></canvas>
            </div>
            <div style={{ width: '30%', marginBottom: '20px' }}>
              <canvas id={`pieChart-${result.keyword}`}></canvas>
            </div>
          </div>
          <div>
            <h3>Trend Data (Jan 1st of Each Year)</h3>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {result.data && result.data.interestOverTime && filterForJanuary(result.data.interestOverTime.default.timelineData).map((item, index) => (
                  <tr key={index}>
                    <td>{item.formattedAxisTime}</td>
                    <td>{item.value[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => exportToExcel(filterForJanuary(result.data.interestOverTime.default.timelineData).map(item => ({
              Time: item.formattedAxisTime,
              Value: item.value[0]
            })), `${result.keyword}_trend_data_jan1.xlsx`)}>Export as XLSX</button>
            <button onClick={() => exportToExcel(filterForJanuary(result.data.interestOverTime.default.timelineData).map(item => ({
              Time: item.formattedAxisTime,
              Value: item.value[0]
            })), `${result.keyword}_trend_data_jan1.csv`)}>Export as CSV</button>
          </div>
          <div>
            <h3>Average Monthly Trend</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {result.data && result.data.monthlyAverages && result.data.monthlyAverages.map((item, index) => (
                  <tr key={index}>
                    <td>{item.month}</td>
                    <td>{item.average}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => exportToExcel(result.data.monthlyAverages, `${result.keyword}_average_monthly_trend.xlsx`)}>Export as XLSX</button>
            <button onClick={() => exportToExcel(result.data.monthlyAverages, `${result.keyword}_average_monthly_trend.csv`)}>Export as CSV</button>
          </div>
          <div>
            <h3>Interest by Region</h3>
            <table>
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {result.data && result.data.interestByRegion && result.data.interestByRegion.default.geoMapData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.geoName}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => exportToExcel(result.data.interestByRegion.default.geoMapData.map(item => ({
              Region: item.geoName,
              Value: item.value
            })), `${result.keyword}_interest_by_region.xlsx`)}>Export as XLSX</button>
            <button onClick={() => exportToExcel(result.data.interestByRegion.default.geoMapData.map(item => ({
              Region: item.geoName,
              Value: item.value
            })), `${result.keyword}_interest_by_region.csv`)}>Export as CSV</button>
          </div>
          <div>
            <h3>Analysis</h3>
            <p>{descriptions[result.keyword] || 'Generating description...'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KeywordTrendAnalyzer;
