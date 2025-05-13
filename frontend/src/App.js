import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Landing';
import Login from './components/Login';
import PostLogin from './components/PostLogin';
import Generation from './components/Generation';
import Dashboard from './components/Dashboard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Navigate } from 'react-router-dom';

function App() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onVerified={() => setIsVerified(true)} />} />
        <Route path="/post-login" element={isVerified ? <PostLogin /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isVerified ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/generate" element={isVerified ? <Generation /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
