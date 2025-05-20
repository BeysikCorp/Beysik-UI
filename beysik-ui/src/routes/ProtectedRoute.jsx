import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component handles routes that require authentication
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Return a loading spinner or placeholder if still checking auth
    return <div>Loading...</div>;
  }

  // If adminOnly is true, check if the user is an admin
  if (adminOnly && (!user || !isAdmin())) {
    // Redirect to login with the current location in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For regular protected routes, just check if user exists
  if (!adminOnly && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If all checks pass, render the children component
  return children;
};

export default ProtectedRoute;