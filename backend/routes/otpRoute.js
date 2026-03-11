import express from "express";
import Otp from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../config/mailer.js";

const router = express.Router();

// ---------------------
// Generate OTP
// ---------------------
router.post("/generate", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Remove old OTP for this email
    await Otp.findOneAndDelete({ email });

    // Save new OTP in DB
    const newOtp = new Otp({ email, otp, createdAt: new Date() });
    await newOtp.save();

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.log("OTP Generation Error:", err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ---------------------
// Verify OTP and login
// ---------------------
router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

  try {
    // Check OTP in DB
    const record = await Otp.findOne({ email, otp: otp.toString().trim() });
    if (!record) return res.status(400).json({ success: false, message: "Invalid OTP" });

    // Delete OTP after use
    await Otp.deleteOne({ email, otp: otp.toString().trim() });

    // Find user
    let user = await userModel.findOne({ email });
    if (!user) {
      // Auto-create user with random password
      const randomPassword = Math.random().toString(36).slice(-8); // 8-char password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = new userModel({
        email,
        name: email.split("@")[0],
        password: hashedPassword
      });
      await user.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, message: "OTP verified", token });
  } catch (err) {
    console.log("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;