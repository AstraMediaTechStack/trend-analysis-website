const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const generateDescription = require('./api/generateDescription');
const keywordRoutes = require('./routes/keywordRoutes');
const youtubeTrendsRoutes = require('./routes/youtubeTrendsRoutes');
const youtubeMetadataController = require('./controllers/youtubeMetadataController');
const { resourcesettings } = require('googleapis/build/src/apis/resourcesettings');
const authController = require('./controllers/authController');
const session = require('express-session');
const facebookRoutes = require('./routes/facebookRoutes')



const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

app.post('/api/youtube/update-metadata', youtubeMetadataController.updateVideoMetadata);
app.use('/api', keywordRoutes);
app.post('/api/generate-description', generateDescription);
app.use('/api/youtube', youtubeTrendsRoutes);
app.use('/api/auth', authController);
app.use('/api/facebook', facebookRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
