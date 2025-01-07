import axios from 'axios';

const API_URL = 'http://localhost:3000/patients'; 

export const getPatients = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error);
    return []; 
  }
};