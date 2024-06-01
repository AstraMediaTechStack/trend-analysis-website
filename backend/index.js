const express = require('express');
const cors = require('cors');
const generateDescription = require('./api/generateDescription');
const fetchTrends = require('./api/trends'); // Make sure this exists and is correctly imported

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-description', generateDescription);
app.get('/keywords/trends', fetchTrends); // Ensure this route is defined

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
