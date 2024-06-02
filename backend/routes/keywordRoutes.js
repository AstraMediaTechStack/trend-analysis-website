const express = require('express');
const router = express.Router();
const trendsApi = require('../api/trends');

router.get('/keywords/trends', trendsApi);

module.exports = router;
