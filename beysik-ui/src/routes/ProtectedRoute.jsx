import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, message: "Please log in to access this page." }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // User is authenticated but not an admin
    return <Navigate to="/unauthorized" state={{ from: location }} replace />; 
    // Or redirect to home with a message:
    // return <Navigate to="/" state={{ message: "You are not authorized to view this page." }} replace />;
  }

  return children;
};

export default ProtectedRoute;