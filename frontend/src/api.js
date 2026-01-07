import axios from 'axios';

// This connects to your FastAPI backend running on port 8000
const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export default API;