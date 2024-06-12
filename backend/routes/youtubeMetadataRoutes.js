const express = require('express');
const youtubeMetadataController = require('../controllers/youtubeMetadataController');
const router = express.Router();

router.post('/update-metadata', youtubeMetadataController.updateVideoMetadata);

module.exports = router;
