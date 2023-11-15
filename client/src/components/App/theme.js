import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Twój niestandardowy kolor główny
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a1887f', // Twój niestandardowy kolor drugorzędny
      light: '#d3b8ae',
      dark: '#725b56',
      contrastText: '#ffffff',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      contrastText: '#ffffff',
    },
    // Dodaj więcej kolorów według potrzeb
  },
});

export default theme;
