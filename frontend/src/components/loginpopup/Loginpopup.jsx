import React, { useContext, useState } from 'react';
import './Loginpopup.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const Loginpopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currentState, setCurrentState] = useState("Login"); // Login or Sign Up
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // Send OTP
  // -------------------------
  const sendOtp = async () => {
    if (!data.email) return alert("Please enter your email");

    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/otp/generate`, { email: data.email });
      alert(res.data.message);
      if (res.data.success) setOtpSent(true);
    } catch (err) {
      console.log("Send OTP error:", err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Verify OTP and auto-login
  // -------------------------
const verifyOtp = async () => {
  if (!otp) return alert("Please enter OTP");

  try {
    setLoading(true);

    const res = await axios.post(`${url}/api/otp/verify`, {
      email: data.email,
      otp: otp.trim()
    });

    if (res.data.success) {

      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);

      // Update context
      setToken(token);

      alert("Login successful");

      setShowLogin(false);

    } else {
      alert(res.data.message);
    }

  } catch (err) {
    console.log("OTP verification error:", err);
    alert("OTP verification failed");
  } finally {
    setLoading(false);
  }
};
  // -------------------------
  // Sign Up
  // -------------------------
  const onSubmit = async (event) => {
    event.preventDefault();
    if (currentState !== "Sign Up") return;

    const { name, email, password } = data;
    if (!name || !email || !password) return alert("Please fill all fields");

    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/user/register`, data);
      if (res.data.success) {
        alert("Account created! Please login with OTP.");
        setCurrentState("Login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log("Sign Up error:", err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onSubmit} noValidate className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState === "Login" ? "Login with OTP" : "Sign Up"}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close" />
        </div>

        <div className="login-popup-input">
          {currentState === "Sign Up" && (
            <input
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder='Your name'
              required
            />
          )}

          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder='Your email'
            required
          />

          {currentState === "Sign Up" && (
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder='Password'
              required
            />
          )}

          {currentState === "Login" && otpSent && (
            <input
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              type="text"
              placeholder="Enter OTP"
              required
            />
          )}
        </div>

        {/* Buttons */}
        {currentState === "Login" ? (
          <button
            type="button"
            onClick={otpSent ? verifyOtp : sendOtp}
            disabled={loading}
          >
            {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        ) : (
          <button type='submit' disabled={loading}>
            {loading ? "Please wait..." : "Create Account"}
          </button>
        )}

        {/* Terms checkbox for Sign Up */}
        {currentState === "Sign Up" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & Privacy policy</p>
          </div>
        )}

        {/* Switch between Login & Sign Up */}
        {currentState === "Login" ? (
          <p>Create a new account? <span onClick={() => { setCurrentState("Sign Up"); setOtpSent(false); }}>Click Here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default Loginpopup;