import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setOtpSent(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      if (res.data.success) {
        login();
        navigate('/post-login');
      } else {
        setError('Invalid OTP');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <div className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={otpSent}
          />

          {otpSent && (
            <input
              className="login-input"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
          )}

          {error && <div className="login-error">{error}</div>}

          <button
            className="login-button"
            onClick={otpSent ? verifyOtp : sendOtp}
            disabled={loading || !email || (otpSent && !otp)}
          >
            {loading ? 'Please wait...' : otpSent ? 'Verify OTP' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
