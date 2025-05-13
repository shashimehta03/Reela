const express = require('express');
const nodemailer = require('nodemailer');
const User = require('../models/User.js');
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:"itsmeshashi29@gmail.com", 
        pass:"vkkowzhynymjqheg",
    },
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    console.log("sending otp",otp);

    await User.findOneAndUpdate(
        { email },
        { otp, otpExpiry: expiry },
        { upsert: true }
    );

    await transporter.sendMail({
        from: `"OTP Service" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    res.json({ message: 'OTP sent' });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required', success: false });
  }
  
  const user = await User.findOne({ email });
  console.log(user,"userrr")
  if (!user) {
    console.log("1");
    return res.status(400).json({ message: 'User not found', success: false });
  }
  
  if (user.otp !== otp) {
    console.log(user.otp,"  ", otp);
    console.log("2");
    return res.status(400).json({ message: 'Invalid OTP', success: false });
  }
  
  if (new Date() > user.otpExpiry) {
    console.log("3");
    return res.status(400).json({ message: 'OTP has expired', success: false });
  }
  
  res.json({ message: 'OTP verified', success: true });
});

module.exports = router;
