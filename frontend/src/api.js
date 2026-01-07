import axios from 'axios';

// This connects to your FastAPI backend running on port 8000
const API = axios.create({
  baseURL: 'https://nextup-backend-ixp0.onrender.com',
});

export default API;