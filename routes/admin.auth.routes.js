const express = require('express');
const { loginPhoneOTP,loginPhoneOTPVerify,loginEmailOTP,loginEmailOTPVerify, logout, Adminprofile } = require('../controllers/admin.auth.controller.js');
const { isAuth } = require('../middlewares/authMiddleware.js');
const isAdmin = require('../middlewares/isAdmin.js');

const router = express.Router();

// Route to send phone OTP
router.post('/login/phone-otp', loginPhoneOTP);

// Route to verify phone OTP
router.post('/login/phone-otp-verify', loginPhoneOTPVerify);

// Route to send email OTP
router.post('/login/email-otp', loginEmailOTP);

// Route to verify email OTP
router.post('/login/email-otp-verify', loginEmailOTPVerify);

// Route to logout
router.post('/logout',isAuth ,isAdmin, logout);

// Route to test if user is admin
router.post('/admin-profile', isAuth, isAdmin, Adminprofile);

module.exports = router;