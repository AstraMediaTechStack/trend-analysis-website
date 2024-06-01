require('dotenv').config();
const OpenAI = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set. Please check your .env file.');
  process.exit(1); // Exit the process if API key is not set
}

console.log('API Key:', OPENAI_API_KEY); // Log the API key to ensure it's being read correctly

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const testOpenAI = async () => {
  try {
    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: 'Hello, OpenAI!',
      max_tokens: 10,
    });

    console.log('Response:', response.choices[0].text.trim());
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testOpenAI();
