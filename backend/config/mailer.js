import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,       // important change
            secure: false,   // true only for port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
        });

        console.log("✅ OTP sent successfully to", email);
        return true;

    } catch (err) {
        console.log("❌ Error sending OTP:", err);
        throw err;
    }
};