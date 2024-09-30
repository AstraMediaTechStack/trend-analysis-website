const express = require('express');
const router = express.Router();
const facebookController = require('../controllers/facebookController');

router.post('/create-post', facebookController.createPost);
router.post('/schedule-post', facebookController.schedulePost);
router.get('/monitor-posts', facebookController.monitorPosts);

module.exports = router;
