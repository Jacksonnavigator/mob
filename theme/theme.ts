import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#00C853',
    secondary: '#4CAF50',
    tertiary: '#81C784',
    surface: '#FFFFFF',
    background: '#F5F5F5',
    onSurface: '#1C1B1F',
    onBackground: '#1C1B1F',
    error: '#B3261E',
    warning: '#F57C00',
    success: '#2E7D32',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#00C853',
    secondary: '#4CAF50',
    tertiary: '#81C784',
    surface: '#1E1E1E',
    background: '#121212',
    onSurface: '#E6E1E5',
    onBackground: '#E6E1E5',
    error: '#F2B8B5',
    warning: '#FFB74D',
    success: '#A5D6A7',
  },
};

export const theme = darkTheme; // Default to dark theme
