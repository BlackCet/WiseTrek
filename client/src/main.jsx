import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';


const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(230, 157, 184)', 
    },
    secondary: {
      main: 'rgb(255, 208, 199)',
    },
    background: {
      default: 'rgb(255, 254, 206)', 
      paper: 'rgb(241, 231, 231)',   
    },
  },
  
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      
      <CssBaseline /> 
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

