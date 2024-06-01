const express = require('express');
const { uploadMetadata, updateMetadata } = require('../controllers/youtubeMetadataController');
const router = express.Router();

router.post('/upload', uploadMetadata);
router.post('/update', updateMetadata);

module.exports = router;
