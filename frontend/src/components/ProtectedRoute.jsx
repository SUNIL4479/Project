import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  console.log('ProtectedRoute: token =', token); // Debug log
  if (!token) {
    console.log('ProtectedRoute: No token, redirecting to /login'); // Debug log
    return <Navigate to="/login" />;
  }
  console.log('ProtectedRoute: Token found, rendering children'); // Debug log
  return children;
};

export default ProtectedRoute;
