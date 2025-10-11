import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ContestDetails from './pages/ContestDetails';
import Submission from './pages/Submission';
import Leaderboard from './pages/Leaderboard';
import Dashboard from "./pages/Dashboard";
import Profile from "./components/Profile";
import ContestsParticipated from "./components/ContestsParticipated";
import ContestsCreated from "./components/ContestsCreated";
import Performance from "./components/Performance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contest/:id" element={<ContestDetails />} />
        <Route path="/contest/:id/submit" element={<Submission />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/" element={<Navigate to="/dashboard/profile" />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="profile" element={<Profile />} />
          <Route path="participated" element={<ContestsParticipated />} />
          <Route path="created" element={<ContestsCreated />} />
          <Route path="performance" element={<Performance />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
