const express = require('express');

// controller functions
const { loginUser, signupUser, verifyUser, resendOtp } = require('../controllers/userController');

const router = express.Router();

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup', signupUser);

// verify otp route
router.post('/verifyOtp', verifyUser);

// resend otp route
router.post('/resendOtp', resendOtp);


module.exports = router;