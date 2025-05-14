import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './Landing';
import Login from './components/Login';
import PostLogin from './components/PostLogin';
import Generation from './components/Generation';
import Dashboard from './components/Dashboard';
import YouTubeCallbackPage from './components/YouTubeCallbackPage';
import NotFoundPage from './components/NotFoundPage';
import { useState, useEffect } from 'react';


function App() {
  const [isVerified, setIsVerified] = useState(() => {
    // Check if user is verified from localStorage
    return localStorage.getItem('isVerified') === 'true';
  });

  useEffect(() => {
    // If verified, set the item in localStorage
    if (isVerified) {
      localStorage.setItem('isVerified', 'true');

      // Set auto-logout timer for 15 minutes (900000 ms)
      const timeout = setTimeout(() => {
        setIsVerified(false);
        localStorage.removeItem('isVerified');
        alert('Session expired. You have been logged out.');
      }, 15 * 60 * 1000);

      // Clear timeout on unmount or change
      return () => clearTimeout(timeout);
    }
  }, [isVerified]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <Login
              onVerified={() => {
                setIsVerified(true);
                localStorage.setItem('isVerified', 'true');
              }}
            />
          }
        />
        <Route path="/post-login" element={isVerified ? <PostLogin /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isVerified ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/youtube-callback" element={<YouTubeCallbackPage />} />
        <Route path="/generate" element={isVerified ? <Generation /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
