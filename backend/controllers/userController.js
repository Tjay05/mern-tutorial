const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
// mongodb user otp verification model
const UserOTPVerification = require('../models/userOtpVerificationModel');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// Nodemailer credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// login user
const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// signup new user
const signupUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.signup(email, password);

    // send otp verification email
    const sendOTPVerificationEmail = async () => {
      try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        // mail options
        const mailOptions = {
          from: process.env.AUTH_EMAIL,
          to: user.email,
          subject: 'Verify Your Email',
          html: `<p>Enter <b>${otp}</b> in the website to verify your email address and complete your signup</p><p>The code will <b>expire in 30 minutes</b>.</p>`
        };

        // hash the otp
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(otp, salt);

        const newOTPVerification = await new UserOTPVerification({ 
          email: user.email, 
          otp: hashedOTP,
          createdAt: Date.now(),
          expiresAt: Date.now() + 1800000,
        });
        
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.status(202).json({message: `Verification OTP sent to ${user.email}`, data: user.email})
      } catch (error) {
        res.status(400).json({error: error.message})
      }
    }

    sendOTPVerificationEmail();
  } catch (error) {
    res.status(400).json({error: error.message})
  }
};

// verify user email
const verifyUser = async (req, res) => {
  const {email, otp} = req.body;

  try {
    const user = await User.verifyOTP(email, otp);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({email, token, message: 'Your email has been verified'});  
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// resend otp
const resendOtp = async (req, res) => {
  const {email} = req.body;

  try {
    if (!email) {
      throw Error("Unknown error, OYO NA YOUR CASE");
    } else {
      await UserOTPVerification.deleteMany({ email });

      // send otp verification email
      const sendOTPVerificationEmail = async () => {
        try {
          const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  
          // mail options
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            html: `<p>Enter <b>${otp}</b> in the website to verify your email address and complete your signup</p><p>The code will <b>expire in 30 minutes</b>.</p>`
          };
  
          // hash the otp
          const salt = await bcrypt.genSalt(10);
          const hashedOTP = await bcrypt.hash(otp, salt);
  
          const newOTPVerification = await new UserOTPVerification({ 
            email, 
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1800000,
          });
          
          await newOTPVerification.save();
          await transporter.sendMail(mailOptions);
  
          res.status(202).json({message: `Verification OTP sent to ${email}`, data: email})
        } catch (error) {
          res.status(400).json({error: error.message})
        }
      }
  
      sendOTPVerificationEmail();
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }

};

module.exports = { loginUser, signupUser, verifyUser, resendOtp }