const googleTrends = require('google-trends-api');

module.exports = async (req, res) => {
  const keyword = req.query.keyword;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  try { 
    
    const interestOverTime = await googleTrends.interestOverTime({ keyword, startTime: new Date(startDate), endTime: new Date(endDate) });

    const interestByRegion = await googleTrends.interestByRegion({ keyword });

    const relatedQueries = await googleTrends.relatedQueries({ keyword, resolution: 'TOP' });

    const risingQueries = await googleTrends.relatedQueries({ keyword, resolution: 'RISING' });
    const dataOverTime = JSON.parse(interestOverTime);
    const dataByRegion = JSON.parse(interestByRegion);
    const dataRelatedQueries = JSON.parse(relatedQueries);
    const dataRisingQueries = JSON.parse(risingQueries);

    // Calculate monthly averages
    const monthlyData = {};
    dataOverTime.default.timelineData.forEach(item => {
      const month = item.formattedAxisTime.split(' ')[0]; // Get month (e.g., "Jan")
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, count: 0 };
      }
      monthlyData[month].total += item.value[0];
      monthlyData[month].count += 1;
    });

    const monthlyAverages = Object.keys(monthlyData).map(month => ({
      month,
      average: monthlyData[month].total / monthlyData[month].count
    }));

    res.status(200).json({ 
      interestOverTime: dataOverTime, 
      monthlyAverages, 
      interestByRegion: dataByRegion, 
      relatedQueries: dataRelatedQueries, 
      risingQueries: dataRisingQueries 
    });
  } catch (error) {
    console.error(`Error fetching trends for keyword: ${keyword}`, error);
    res.status(500).send({ error: "Failed to fetch trends data" });
  }
};
