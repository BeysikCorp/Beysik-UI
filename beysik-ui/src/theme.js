import { createTheme } from '@mui/material/styles';

// Define common style values as constants for consistency
const COLORS = {
  primary: '#222222',
  primaryLight: '#444444',
  secondary: '#757575',
  textPrimary: '#222222',
  textSecondary: '#555555',
  background: '#ffffff',
  backgroundAlt: '#f9f9f9',
  subtleHover: 'rgba(34,34,34,0.04)',
  borderColor: '#e0e0e0',
};

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.primary,
      light: COLORS.primaryLight,
    },
    secondary: {
      main: COLORS.secondary,
    },
    background: {
      default: COLORS.background,
      paper: COLORS.background,
      alt: COLORS.backgroundAlt,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.8rem',
      fontWeight: 600,
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      position: 'relative',
    },
    h3: {
      fontSize: '1.1rem',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      color: COLORS.textPrimary,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          overflowY: 'scroll', // Add this line
        },
        body: {
          backgroundColor: COLORS.background,
          color: COLORS.textPrimary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '8px 18px',
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          backgroundColor: COLORS.primary,
          color: COLORS.background,
          '&:hover': {
            backgroundColor: COLORS.primaryLight,
          },
        },
        outlinedPrimary: {
          borderColor: COLORS.primary,
          color: COLORS.primary,
          '&:hover': {
            backgroundColor: COLORS.subtleHover,
            borderColor: COLORS.primary,
          },
        },
        textPrimary: {
          color: COLORS.primary,
          '&:hover': {
            backgroundColor: COLORS.subtleHover,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          boxShadow: 'none',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.background,
          color: COLORS.textPrimary,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: COLORS.textPrimary,
          transition: 'transform 0.2s ease',
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '20px',
          paddingRight: '20px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
  },
  // Responsive breakpoints - matching MUI defaults for consistency
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  // Custom spacing for consistent spacing throughout the app
  spacing: 8,
});

export default theme;