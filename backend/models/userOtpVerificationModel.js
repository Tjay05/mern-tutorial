const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userOTPVerificationSchema = new Schema({
  email: String,
  otp: String,
  createdAt: Date,
  expiresAt: Date,
});

module.exports = mongoose.model('UserOTPVerification', userOTPVerificationSchema);