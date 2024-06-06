const express = require('express');
const cors = require('cors');
const generateDescription = require('./api/generateDescription');
const keywordRoutes = require('./routes/keywordRoutes');
const youtubeTrendsRoutes = require('./routes/youtubeTrendsRoutes');


const app = express();
app.use(cors());

app.use(express.json());

app.use('/api', keywordRoutes); // Use the router for /api endpoints
app.post('/api/generate-description', generateDescription);
app.use('/api/youtube', youtubeTrendsRoutes); // This ensures that '/api/youtube/trending' will be handled


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
