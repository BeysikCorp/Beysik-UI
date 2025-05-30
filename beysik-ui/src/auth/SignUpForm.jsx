import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async () => {
    await login({ authorizationParams: { screen_hint: 'signup' } });
  };
  
  const handleLogin = async () => {
    await login();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Create Your Beysik Account
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Join us to start shopping!
      </Typography>
      <Button
        onClick={handleSignUp}
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 1 }}
      >
        Sign Up with Email
      </Button>
      <Button
        onClick={handleLogin}
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Already have an account? Log In
      </Button>
    </Paper>
  );
};

export default SignUpForm;