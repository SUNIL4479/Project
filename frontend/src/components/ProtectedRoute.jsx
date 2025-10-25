import {useState,useEffect} from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = () => {
      // Check all possible token sources
      const token = localStorage.getItem('auth_token') || 
                   localStorage.getItem('google_auth_token');
      
      console.log('ProtectedRoute: checking authentication...', {
        auth_token: localStorage.getItem('auth_token'),
        google_auth_token: localStorage.getItem('google_auth_token')
      });

      if (token) {
        setIsAuthenticated(true);
        console.log('ProtectedRoute: Valid token found');
      } else {
        setIsAuthenticated(false);
        console.log('ProtectedRoute: No valid token found');
      }
      setIsLoading(false);
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Authenticated, rendering children');
  return children;
};

export default ProtectedRoute;
