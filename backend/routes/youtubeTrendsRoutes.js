const express = require('express');
const router = express.Router();
const youtubeTrendsController = require('../controllers/youtubeTrendsController');

router.get('/trending', youtubeTrendsController.getTrendingVideos);

module.exports = router;
