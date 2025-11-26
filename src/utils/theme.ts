import { createTheme } from '@mui/material/styles';
import { green, blue, lime, cyan } from '@mui/material/colors';

// Saqtau Platform Colors
const saqtauColors = {
  // SaqtauFood (Food) - Green theme
  food: {
    primary: '#2E7D32', // Dark green
    secondary: '#4CAF50', // Medium green
    accent: '#81C784', // Light green
    light: '#E8F5E8', // Very light green
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
  },
  // SaqtauKiem (Fashion) - Blue theme
  fashion: {
    primary: '#2196F3', // Bright blue
    secondary: '#03A9F4', // Light blue
    accent: '#81D4FA', // Very light blue
    light: '#E3F2FD', // Pale blue
    gradient: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    }
  }
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: saqtauColors.food.primary,
      light: saqtauColors.food.accent,
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: saqtauColors.fashion.primary,
      light: saqtauColors.fashion.accent,
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    background: {
      default: saqtauColors.neutral.gray[50],
      paper: '#FFFFFF',
    },
    text: {
      primary: saqtauColors.neutral.gray[900],
      secondary: saqtauColors.neutral.gray[600],
    },
    success: {
      main: green[600],
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          padding: '12px 24px',
          fontSize: '0.95rem',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: saqtauColors.food.gradient,
          '&:hover': {
            background: saqtauColors.food.gradient,
            opacity: 0.9,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export const foodTheme = createTheme(lightTheme, {
  palette: {
    primary: {
      main: saqtauColors.food.primary,
      light: saqtauColors.food.accent,
      dark: '#1B5E20',
    },
  },
});

export const fashionTheme = createTheme(lightTheme, {
  palette: {
    primary: {
      main: saqtauColors.fashion.primary,
      light: saqtauColors.fashion.accent,
      dark: '#0D47A1',
    },
  },
});

// Theme utilities
export const getThemeByCategory = (category: 'food' | 'fashion') => {
  return category === 'food' ? foodTheme : fashionTheme;
};

export const saqtauPalette = saqtauColors;
