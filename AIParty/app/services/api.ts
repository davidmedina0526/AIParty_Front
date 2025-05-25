import axios from 'axios';
export const API_URL = 'http://localhost:4000/api';
export default axios.create({ baseURL: API_URL });