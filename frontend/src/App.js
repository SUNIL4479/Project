import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ContestDetails from './pages/ContestDetails';
import Submission from './pages/Submission';
import Leaderboard from './pages/Leaderboard';
import GitHubCallback from './pages/GitHubCallback';
import CollegeApi from './API/collegeApi';
function App() {
  return (
    <CollegeApi />
    // <GoogleOAuthProvider clientId="775488422407-l5jhu92f2cm3cehcrff0cncsvoqd1uoo.apps.googleusercontent.com">
    //   <Router>
    //     <Routes>
    //       <Route path="/" element={<LandingPage />} />
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/contest/:id" element={<ContestDetails />} />
    //       <Route path="/contest/:id/submit" element={<Submission />} />
    //       <Route path="/leaderboard" element={<Leaderboard />} />
    //       <Route path="/login/oauth2/code/github" element={<GitHubCallback />} />
    //     </Routes>
    //   </Router>
    // </GoogleOAuthProvider>
  );
}

export default App;
