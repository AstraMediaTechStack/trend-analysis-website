const express = require('express');
const router = express.Router();
const trendsApi = require('../api/trends');

router.get('/trends', trendsApi);

module.exports = router;
