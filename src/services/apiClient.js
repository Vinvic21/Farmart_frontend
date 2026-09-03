import axios from 'axios';

const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Render's free tier spins the backend down after ~15 min idle, and
  // waking it back up can take 30-60s. A short/no timeout here just means
  // a cold start gets misread as a failed request. This gives it room to
  // actually finish waking up before we give up.
  timeout: 60000,
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
  (error) => Promise.reject(error)
);

// If the access token has expired/is invalid, clear stale auth state so the
// user isn't stuck with a broken session. (Full refresh-token support can be
// added later using POST /auth/refresh.)
APIClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default APIClient;