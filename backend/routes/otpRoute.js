import express from "express";
import Otp from "../models/otpModel.js";
import userModel from "../models/userModel.js";
import { sendOTPEmail } from "../config/mailer.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate OTP
router.post("/generate", async (req, res) => {
    const { email } = req.body;

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not registered. Please sign up first"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await Otp.deleteMany({ email });

        const newOtp = new Otp({
            email,
            otp
        });

        await newOtp.save();

        await sendOTPEmail(email, otp);

        res.json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error sending OTP"
        });
    }
});


router.post("/verify", async (req, res) => {
  const { email, otp } = req.body;

  try {

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // delete OTP after verification
    await Otp.deleteMany({ email });

    // find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error verifying OTP"
    });
  }
});
export default router;