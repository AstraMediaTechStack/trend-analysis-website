const fs = require('fs');
const googleTrends = require('google-trends-api');

const generateData = async () => {
  const keyword = 'computer science';
  const startDate = '2000-01-01';
  const endDate = '2024-12-31';

  try {
    const interestOverTime = await googleTrends.interestOverTime({ keyword, startTime: new Date(startDate), endTime: new Date(endDate) });
    const relatedQueries = await googleTrends.relatedQueries({ keyword, resolution: 'TOP' });

    const dataOverTime = JSON.parse(interestOverTime).default.timelineData.map(item => ({
      time: item.formattedAxisTime,
      value: item.value[0]
    }));

    const dataRelatedQueries = JSON.parse(relatedQueries).default.rankedList[0].rankedKeyword.map(item => ({
      query: item.query,
      value: item.value
    }));

    fs.writeFileSync('linedata.json', JSON.stringify({ interestOverTime: dataOverTime }, null, 2));
    fs.writeFileSync('piedata.json', JSON.stringify({ relatedQueries: dataRelatedQueries }, null, 2));

    console.log('Data generated successfully!');
  } catch (error) {
    console.error(`Error fetching trends for keyword: ${keyword}`, error);
  }
};

generateData();
