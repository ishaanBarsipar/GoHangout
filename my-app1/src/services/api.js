import axios from 'axios';

// "Smart" Base URL Logic:
// 1. If running in Docker/Production (import.meta.env.PROD), use relative path '/api'.
//    (Nginx takes this and forwards it to the backend container).
// 2. If running locally (npm run dev), go directly to localhost:8080.
const BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;