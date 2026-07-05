import axios from 'axios';
const API_BASE = 'http://localhost:8080/api';
export const analyzeTemperature = async (temperature, humidity, location) => {
  const response = await axios.post(`${API_BASE}/analyze-temperature`, { temperature, humidity, location });
  return response.data;
};
export const checkEmergency = async (destination, reason, temperature, humidity) => {
  const response = await axios.post(`${API_BASE}/emergency-check`, { destination, reason, temperature, humidity });
  return response.data;
};
export const getRecentReadings = async () => { const r = await axios.get(`${API_BASE}/recent-readings`); return r.data; };
export const getRecentAlerts = async () => { const r = await axios.get(`${API_BASE}/recent-alerts`); return r.data; };
