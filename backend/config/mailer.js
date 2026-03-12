import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // must be false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    });

    console.log("OTP email sent");
  } catch (error) {
    console.log("❌ Error sending OTP:", error);
  }
};