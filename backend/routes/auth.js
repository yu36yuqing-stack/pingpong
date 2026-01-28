
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
// Demo-only shortcut (no WeChat): create/get user and issue JWT
router.post('/dev-login', authController.devLogin);

module.exports = router;
