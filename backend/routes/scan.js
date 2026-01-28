
const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/auth');

router.post('/checkin', authMiddleware, scanController.checkin);

module.exports = router;
