const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const config = {
  isDevelopment,
  isProduction: !isDevelopment,
  apiBaseUrl: process.env.REACT_APP_API_URL || 'http://192.168.1.8:5500',
};

export default config;
