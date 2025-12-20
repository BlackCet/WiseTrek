import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './index.css'; 

// This theme pulls directly from your @theme inline CSS variables
const theme = createTheme({
  palette: {
    primary: {
      main: '#030213', // Matches --primary
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#717182', // Matches --muted-foreground
    },
    background: {
      default: '#ffffff', // Matches --background
      paper: '#ffffff',   // Matches --card
    },
    text: {
      primary: '#030213',   // Matches --foreground
      secondary: '#717182', // Matches --muted-foreground
    },
    error: {
      main: '#d4183d', // Matches --destructive
    },
    divider: 'rgba(0, 0, 0, 0.1)', // Matches --border
  },
  
  typography: {
    // Matches your CSS variable font-weights
    fontFamily: 'Inter, system-ui, sans-serif',
    h1: { fontWeight: 500 }, 
    h2: { fontWeight: 500 },
    h3: { fontWeight: 500 },
    button: {
      fontWeight: 500,
      textTransform: 'none', 
    }
  },

  shape: {
    borderRadius: 10, // Matches --radius (0.625rem)
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Using the CSS variable ensures it updates if you change CSS
          borderRadius: 'var(--radius-lg)', 
          padding: '10px 24px',
          boxShadow: 'none',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          '&:hover': {
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-foreground)',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--card)',
          color: 'var(--card-foreground)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          backgroundImage: 'none', // Fixes MUI dark mode overlay issues
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'var(--input-background)',
            borderRadius: 'var(--radius-md)',
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'var(--border)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'var(--ring)',
            },
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>
);