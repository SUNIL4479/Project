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
import CreateQuestion from './Questions/CreateQuestion';
import Home from './components/Home-Dashboard/Home';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateContest from "./components/Contests/createContest"
function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path='/Home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="participated" element={<ContestsParticipated />} />
            <Route path="created" element={<ContestsCreated />} />
            <Route path='create-contest' element={<CreateContest/>}/>
            <Route path="performance" element={<Performance />} />
          </Route>
          <Route path="/contest/:id" element={<ProtectedRoute><ContestDetails /></ProtectedRoute>} />
          <Route path="/contest/:id/submit" element={<ProtectedRoute><Submission /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/login/oauth2/code/github" element={<GitHubCallback />} />
        </Routes>
      </Router>
  </GoogleOAuthProvider>
  );
}

export default App;
