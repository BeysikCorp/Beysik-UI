import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    await login();
  };

  const handleSignUp = async () => {
    await login({ authorizationParams: { screen_hint: 'signup' } });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Welcome to Beysik
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Please log in or sign up to continue.
      </Typography>
      <Button
        onClick={handleLogin}
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 1 }}
      >
        Log In
      </Button>
      <Button
        onClick={handleSignUp}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Sign Up
      </Button>
    </Paper>
  );
};

export default LoginForm;