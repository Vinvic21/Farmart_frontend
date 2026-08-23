import axios from 'axios';

const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

APIClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

APIClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
      }

      if (status === 403) {
        console.error('Access denied.');
      }

      if (status === 404) {
        console.error('Resource not found.');
      }

      if (status >= 500) {
        console.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      console.error('No response received from the server.');
    } else {
      console.error('Request error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default APIClient;
