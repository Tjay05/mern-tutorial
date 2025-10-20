const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserOTPVerification = require('../models/userOtpVerificationModel');

// External configs
const cloudinary = require('../config/cloudinaryConfig');
const transporter = require('../config/mailerConfig');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

// Function to send OTP verification email
const sendOTPVerificationEmail = async (email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Enter <b>${otp}</b> in the website to verify your email address and complete your signup</p>
      <p>The code will <b>expire in 30 minutes</b>.</p>`
    };

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const otpDoc = new UserOTPVerification({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800000, // 30 minutes
    });

    await otpDoc.save();

    // to be removed
    console.log('otp doc saved');

    await transporter.sendMail(mailOptions);

    // To be removed
    console.log('email sent');

    res.status(200).json({ message: `Verification OTP sent to ${email}`, data: email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

    await sendOTPVerificationEmail(user.email, res);
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

    res.status(200).json({email, token});  
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// resend otp
const resendOtp = async (req, res) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).json({ error: "Unknown error, OYO NA YOUR CASE" });
  }

  try {
    await UserOTPVerification.deleteMany({ email });

    await sendOTPVerificationEmail(email, res);    
  } catch (error) {
    res.status(400).json({error: error.message});
  }

};

const generateSignature = async (req, res) => {
  const { folder } = req.body;

  try {
    const timestamp = Math.round((new Date).getTime() / 1000)

    const signature = cloudinary.utils.api_sign_request({
      timestamp,
      folder
    }, process.env.CLOUDINARY_API_SECRET);

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadProfilePic = async (req, res) => {
  const { email, imgUrl } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { profilePic: imgUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, picture: updatedUser.profilePic });
  } catch (error) {
    res.status(400).json({error: `This is the error ${error.message}`})
  }
}

module.exports = { loginUser, signupUser, verifyUser, resendOtp, generateSignature, uploadProfilePic }