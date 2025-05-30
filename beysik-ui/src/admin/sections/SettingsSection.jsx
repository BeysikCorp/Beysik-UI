// filepath: beysik-ui/src/admin/sections/SettingsSection.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Typography, Paper, TextField, Button, Grid, Switch, FormControlLabel } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { getSettings, updateSettings as apiUpdateSettings } from '../../services/settingsService';
// import '../../styles/SettingsSection.css'; // Ensure this CSS file exists or create it

const SettingsSection = () => {
  const { getAccessToken } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Beysik Store',
    contactEmail: 'support@beysik.com',
    maintenanceMode: false,
    currency: 'USD',
    // Add more settings as needed
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication token not available.");
      const currentSettings = await getSettings(token);
      if (currentSettings) {
        setSettings(prevSettings => ({ ...prevSettings, ...currentSettings }));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(`Failed to load settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Authentication token not available.");
      await apiUpdateSettings(settings, token);
      setSuccessMessage('Settings updated successfully!');
      // Optionally re-fetch settings or assume the submitted ones are now current
      // fetchSettings(); 
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(`Failed to update settings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>General Settings</Typography>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #EBEBEB' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                size="small"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                size="small"
                disabled={isLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                size="small"
                disabled={isLoading}
                // You might want to use a Select component here for predefined currencies
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    name="maintenanceMode"
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label="Enable Maintenance Mode"
              />
            </Grid>
            {/* Add more settings fields as needed */}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </form>
        {isLoading && <p>Loading settings...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </Paper>

      {/* You can add more Paper components for different setting categories */}
      {/* e.g., Payment Gateway Settings, Shipping Settings, etc. */}
    </>
  );
};

export default SettingsSection;