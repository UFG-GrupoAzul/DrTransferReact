import axios from 'axios';
import { API_CONFIG } from '../config/api';

const API_URL = `${API_CONFIG.baseURL}/patients`;


export interface Person {
  id: string;
  name: string;
  cpf: string;
  gender: string;
  phone?: string;
}

export interface Patient {
  id: string;
  person: Person;
  birthDate: string;
  bloodType: string;
}

export interface PatientInput {
  name: string;
  birthDate: string;
  cpf: string;
  gender: string;
  phone?: string;
  bloodType: string;
}

class PatientService {
  async getAll(): Promise<Patient[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async create(patient: PatientInput): Promise<Patient> {
    const response = await axios.post(API_URL, patient);
    return response.data;
  }

  async update(id: string, patient: PatientInput): Promise<Patient> {
    const response = await axios.put(`${API_URL}/${id}`, patient);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new PatientService();