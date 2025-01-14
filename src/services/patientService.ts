import axios from 'axios';
import { API_CONFIG } from '../config/api';

const API_URL = `${API_CONFIG.baseURL}/patients`;

export interface Person {
  id?: string;
  name: string;
  cpf: string;
  gender: string;
  phone?: string;
  dType?: string;
}

export interface Patient {
  id: number;
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
  private transformInput(data: PatientInput) {
    return {
      birthDate: new Date(data.birthDate).toISOString(),
      bloodType: data.bloodType,
      name: data.name.trim(),
      cpf: data.cpf.trim(),
      gender: data.gender,
      phone: data.phone?.trim() || null,
    };
  }

  async getAll(): Promise<Patient[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }

  async create(data: PatientInput): Promise<Patient> {
    try {
      const transformedData = this.transformInput(data);
      console.log('Dados enviados:', transformedData);
      const response = await axios.post(API_URL, transformedData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar paciente:', error.response?.data || error.message);
      throw error;
    }
  }

  async update(id: number, data: PatientInput): Promise<Patient> {
    try {
      const transformedData = this.transformInput(data);
      console.log('Dados enviados:', transformedData);
      const response = await axios.put(`${API_URL}/${id}`, transformedData);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar paciente:', error.response?.data || error.message);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${API_URL}/${id}`);
  }
}

export default new PatientService();