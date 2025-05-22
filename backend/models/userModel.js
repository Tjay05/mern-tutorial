const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const UserOTPVerification = require('./userOtpVerificationModel');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  }
})

// static signup method
userSchema.statics.signup = async function(email, password) {

  // validation
  if (!email || !password) {
    throw Error("All fields must be filled")
  }
  if (!validator.isEmail(email)) {
    throw Error('Email is not valid')
  }
  if(!validator.isStrongPassword(password)) {
    throw Error("Password ain't strong enough")
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user
}

userSchema.statics.verifyOTP = async function(email, otp) {
  if (!email || !otp) {
    throw Error("Please fill in OTP fields");
  } else {
    const UserOTPVerificationRecords = await UserOTPVerification.find({
      email,
    });
    if (UserOTPVerificationRecords.length <= 0) {
      // No record found
      throw new Error('Account record does not exist or has been verified already. Please sign up or log in.')
    } else {
      // Otp exists
      const { expiresAt } = UserOTPVerificationRecords[0];
      const hashedOTP = UserOTPVerificationRecords[0].otp;

      if (expiresAt < Date.now()) {
        await UserOTPVerification.deleteMany({ email });
        throw new Error('The OTP has expired. Please request another one');
      } else {
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
          throw new Error('Invalid otp, confirm the code in your inbox');
        } else {
          // mark as verified
          await this.updateOne({ email }, { verified: true });
          // delete otp records
          await UserOTPVerification.deleteMany({ email });

          const user = await this.findOne({ email });
          
          return user;
        }
      }
    }
  }
}

// static login method
userSchema.statics.login = async function(email, password) {

  if (!email || !password) {
    throw Error("All fields must be filled")
  }

  const user = await this.findOne({ email })

  if (!user) {
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw Error('Incorrect password')
  }

  return user;
}

module.exports = mongoose.model('User', userSchema);