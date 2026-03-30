const express = require('express');
const {
  login,
  register,
  getAuthInfo,
  updateProfile,
  bindPhone,
  sendSmsCode,
  bindEmail,
  sendEmailCode,
  changePassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 公开接口
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/sms/send', sendSmsCode);
router.post('/auth/email/send', sendEmailCode);

// 需要认证的接口
router.get('/auth/info', authMiddleware, getAuthInfo);
router.put('/auth/profile', authMiddleware, updateProfile);
router.post('/auth/bind-phone', authMiddleware, bindPhone);
router.post('/auth/bind-email', authMiddleware, bindEmail);
router.post('/auth/change-password', authMiddleware, changePassword);

module.exports = router;
