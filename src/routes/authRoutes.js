const express = require('express');
const { login, getAuthInfo } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/login', login);
router.get('/auth/info', authMiddleware, getAuthInfo);

module.exports = router;
