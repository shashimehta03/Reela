import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Video Content Creation Platform</h1>
        <p className="landing-subtitle">
          Transform your ideas into engaging video content with AI-powered tools
        </p>

        <div className="landing-features">
          <div className="feature-card">
            <h3 className="feature-title">AI-Powered Generation</h3>
            <p className="feature-description">
              Create compelling video content using advanced AI technology
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Easy to Use</h3>
            <p className="feature-description">
              Simple interface that makes content creation accessible to everyone
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Quick Results</h3>
            <p className="feature-description">
              Generate professional-quality videos in minutes, not hours
            </p>
          </div>
        </div>

        <div className="landing-cta">
          <button className="landing-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
