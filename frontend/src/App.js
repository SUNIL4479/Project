import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import ContestDetails from './pages/ContestDetails';
import Submission from './pages/Submission';
import Leaderboard from './pages/Leaderboard';
import GitHubCallback from './pages/GitHubCallback';
import Dashboard from './pages/Dashboard';
import Profile from './components/Profile';
import ContestsParticipated from './components/Contestsparticipated';
import ContestsCreated from './components/Contestscreated';
import Performance from './components/Performance';
import AuthSuccess from './pages/AuthSuccess';
function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="participated" element={<ContestsParticipated />} />
            <Route path="created" element={<ContestsCreated />} />
            <Route path="performance" element={<Performance />} />
          </Route>
          <Route path="/contest/:id" element={<ContestDetails />} />
          <Route path="/contest/:id/submit" element={<Submission />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login/oauth2/code/github" element={<GitHubCallback />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
