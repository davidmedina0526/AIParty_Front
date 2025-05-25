import axios from 'axios';

const API_URL = 'https://back-end-final-movil-2025-1.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;
