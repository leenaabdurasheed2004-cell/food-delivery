import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP Verification",
      html: `<h2>Your OTP is: ${otp}</h2>`
    });

    console.log("OTP email sent:", response);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
};