import axios from 'axios';

const API_URL = 'http://localhost:3000/specialties';

export interface Specialty {
  id: number;
  name: string;
  description: string;
}

export const getSpecialties = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createSpecialty = async (specialtyData: Omit<Specialty, 'id'>) => {
  const response = await axios.post(API_URL, specialtyData);
  return response.data;
};

export const updateSpecialty = async (id: number, specialtyData: Omit<Specialty, 'id'>) => {
  const response = await axios.put(`${API_URL}/${id}`, specialtyData);
  return response.data;
};

export const deleteSpecialty = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}; 