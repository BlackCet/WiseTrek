import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './index.css'; 

// WiseTrek Theme Palette
// 100: #FFF2D7 (Cream)
// 200: #FFE0B5 (Peach)
// 300: #F8C794 (Sand)
// 400: #D8AE7E (Clay)

const theme = createTheme({
  palette: {
    primary: {
      main: '#D8AE7E', // Clay (Buttons, Highlights)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F8C794', // Sand
    },
    background: {
      default: '#FFF2D7', // Cream Background
      paper: '#ffffff',   
    },
    text: {
      // UPDATED: Darker colors for better readability
      primary: '#2C1810',   // Very Dark Brown (Almost Black)
      secondary: '#5D4037', // Medium Dark Brown
    },
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    allVariants: {
      color: '#2C1810', // Forces all text to be the dark brown by default
    },
    h2: {
      fontWeight: 900,
      color: '#D8AE7E', // Keep the big title in Clay color
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 'bold',
      textTransform: 'none',
    }
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
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