import { createTheme } from '@mui/material/styles';

// Enhanced color palette with a richer design language
const COLORS = {
  primary: '#1A1A1A',
  primaryLight: '#2C2C2C',
  secondary: '#937D64', // Warm accent color
  textPrimary: '#1A1A1A',
  textSecondary: '#5F5F5F',
  background: '#FFFFFF',
  backgroundAlt: '#F8F8F8',
  surface: '#FFFFFF',
  error: '#D32F2F',
  success: '#4CAF50',
  subtleHover: 'rgba(26,26,26,0.04)',
  borderColor: '#EBEBEB',
  divider: '#EBEBEB',
};

const FONT = {
  primary: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
};

// Custom shadows for depth
const SHADOWS = {
  small: '0 2px 8px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
  large: '0 8px 30px rgba(0, 0, 0, 0.16)',
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
      paper: COLORS.surface,
      alt: COLORS.backgroundAlt,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
    error: {
      main: COLORS.error,
    },
    success: {
      main: COLORS.success,
    },
    divider: COLORS.divider,
  },
  typography: {
    fontFamily: FONT.primary,
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: {
          backgroundColor: COLORS.background,
          color: COLORS.textPrimary,
        },
        a: {
          textDecoration: 'none',
          color: 'inherit',
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '10px 22px',
          transition: 'all 0.3s ease',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: COLORS.primary,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: COLORS.primaryLight,
            boxShadow: SHADOWS.small,
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
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          border: `1px solid ${COLORS.borderColor}`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: SHADOWS.medium,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: 'none',
          border: `1px solid ${COLORS.borderColor}`,
        },
        elevation1: {
          boxShadow: SHADOWS.small,
        },
        elevation2: {
          boxShadow: SHADOWS.medium,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.background,
          color: COLORS.textPrimary,
          boxShadow: SHADOWS.small,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: COLORS.borderColor,
            },
            '&:hover fieldset': {
              borderColor: COLORS.primary,
            },
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: COLORS.textSecondary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.divider,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: COLORS.backgroundAlt,
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  spacing: 8,
});

export default theme;