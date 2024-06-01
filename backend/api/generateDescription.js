// api/generateDescription.js
const { LanguageServiceClient } = require('@google-cloud/language');
require('dotenv').config();

const client = new LanguageServiceClient();

const generateDescription = async (prompt) => {
  const document = {
    content: prompt,
    type: 'PLAIN_TEXT',
  };

  try {
    const [result] = await client.analyzeEntities({ document });
    const entities = result.entities.map(entity => entity.name).join(', ');
    return `The analysis includes the following entities: ${entities}`;
  } catch (error) {
    console.error('Error in generateDescription:', error);
    throw error;
  }
};

module.exports = async (req, res) => {
  const { keyword, trendData, monthlyAverages } = req.body;

  const prompt = `
  Analyze the following data for the keyword "${keyword}":

  Trend Data (Jan 1 of each year):
  ${trendData.map(item => `Year: ${item.formattedAxisTime}, Value: ${item.value[0]}`).join('\n')}

  Average Monthly Trend:
  ${monthlyAverages.map(item => `Month: ${item.month}, Average: ${item.average}`).join('\n')}
  
  Provide a short (in one paragraph) analysis the trends observed for this keyword.
  `;

  try {
    const description = await generateDescription(prompt);
    res.status(200).json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
};
