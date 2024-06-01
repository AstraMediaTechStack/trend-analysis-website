const express = require('express');
const { getTopTrends } = require('../controllers/youtubeTrendsController');
const router = express.Router();

router.get('/trends', getTopTrends);

module.exports = router;
