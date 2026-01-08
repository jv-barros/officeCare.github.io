const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts from this IP, please try again later',
});

router.get('/login', authController.getLogin);
router.post('/login', loginLimiter, authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;