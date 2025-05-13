import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostLogin.css';

export default function PostLogin() {
  const nav = useNavigate();
  return (
    <div className="post-login-container">
      <div className="post-login-card">
        <h1 className="post-login-title">Welcome to Video Content Generator</h1>
        <div className="post-login-buttons">
          <button className="post-login-button" onClick={() => nav('/dashboard')}>
            Go to Dashboard
          </button>
          <button className="post-login-button" onClick={() => nav('/generate')}>
            Generate New Content
          </button>
        </div>
      </div>
    </div>
  );
}
