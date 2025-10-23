const nodemailer = require('nodemailer');

// Nodemailer credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  // port: 465,
  // secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.AUTH_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
  },
});

module.exports = transporter;
