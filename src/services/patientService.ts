import axios from 'axios';

const API_URL = 'http://localhost:3000/patients';

export const getPatients = async () => {
  const response = await axios.get(API_URL);
  return response.data;

};


export const createPatient = async (patientData: any) => {
  const response = await axios.post(API_URL, patientData);
  return response.data;
}

export const deletePatient = async (id: string) =>
{
  const response = await axios.delete(`${API_URL}/${id}`)
  return response.data;

}