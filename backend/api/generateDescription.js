require('dotenv').config();
const { OpenAI } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Please check your .env file.');
  process.exit(1); // Exit the process if API key is not set
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const generateDescription = async (prompt) => {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides detailed trend analyses.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      
      console.log(response.choices[0].message.content);
      if (response && response.choices && response.choices.length > 0) {
        return response.choices[0].message.content.trim();
      } else {
        throw new Error('No text generated');
      }
    } catch (error) {
      if (error.response && error.response.status === 429 && retries < maxRetries) {
        console.error(`Rate limit exceeded. Retrying in ${2 ** retries} seconds...`);
        await delay(2 ** retries * 1000); // Exponential backoff
        retries += 1;
      } else {
        console.error('Error in generateDescription:', error);
        throw error;
      }
    }
  }
  throw new Error('Failed to generate description after maximum retries');
};

module.exports = async (req, res) => {
  const { keyword, trendData, monthlyAverages } = req.body;

  const prompt = `
  The following is a trend analysis for the keyword "${keyword}".
  Trend Data (Jan 1 of each year):
  ${trendData.map(item => `Year: ${item.formattedAxisTime}, Value: ${item.value[0]}`).join('\n')}
  Please provide a short analysis and description of the trends observed for this keyword. Explain any noticeable patterns and also give reasons why each change is occuring based on the keyword.
  `;

  try {
    const description = await generateDescription(prompt);
    res.status(200).json({ description });
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Failed to generate description' });
  }
};
