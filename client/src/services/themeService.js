import axios from 'axios';

const API_URL = '/api/themes'; // Endpoint za teme (backend rute)

// Funkcija za dobavljanje tema od servera
export const fetchThemes = () => {
  return axios.get(API_URL);
};
