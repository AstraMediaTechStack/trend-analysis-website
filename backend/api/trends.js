const googleTrends = require('google-trends-api');

module.exports = async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const interestOverTime = await googleTrends.interestOverTime({ keyword });
    const interestByRegion = await googleTrends.interestByRegion({ keyword });
    const dataOverTime = JSON.parse(interestOverTime);
    const dataByRegion = JSON.parse(interestByRegion);

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
    console.log(dataOverTime);
    res.status(200).json({ interestOverTime: dataOverTime, monthlyAverages, interestByRegion: dataByRegion });
  } catch (error) {
    console.error(`Error fetching trends for keyword: ${keyword}`, error);
    res.status(500).send({ error: "Failed to fetch trends data" });
  }
};
