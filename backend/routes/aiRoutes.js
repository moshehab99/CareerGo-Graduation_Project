const express = require('express');
const router = express.Router();
const { matchJob } = require('../controllers/aiController');
const { protect, candidateOnly } = require('../middleware/auth');

router.post('/match', protect, candidateOnly, matchJob);

module.exports = router;
