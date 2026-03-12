import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",   // simpler and more reliable
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Food Delivery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    console.log("✅ OTP email sent successfully");
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};