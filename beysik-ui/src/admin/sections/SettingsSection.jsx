// filepath: beysik-ui/src/admin/sections/SettingsSection.jsx
import React from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Switch, FormControlLabel } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const SettingsSection = () => {
  // Placeholder state for settings
  const [settings, setSettings] = React.useState({
    siteName: 'Beysik Store',
    contactEmail: 'support@beysik.com',
    maintenanceMode: false,
    currency: 'USD',
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Add logic to save settings to backend or localStorage
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 3 }}>General Settings</Typography>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #EBEBEB' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Site Name"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              size="small"
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
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Paper>

      {/* You can add more Paper components for different setting categories */}
      {/* e.g., Payment Gateway Settings, Shipping Settings, etc. */}
    </>
  );
};

export default SettingsSection;