import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Landing';
import Login from './components/Login';
import PostLogin from './components/PostLogin';
import Generation from './components/Generation';
import Dashboard from './components/Dashboard';
import YouTubeCallbackPage from './components/YouTubeCallbackPage';
import NotFoundPage from './components/NotFoundPage';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isVerified } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Login />}
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
