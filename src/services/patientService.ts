import axios from 'axios';
import { API_CONFIG } from '../config/api';

const API_URL = `${API_CONFIG.baseURL}/patients`;

export interface PatientInput {
    name: string;
    birthDate: string;
    cpf: string;
    gender: string;
    phone?: string;
    bloodType: string;
}
export interface Patient extends PatientInput {
    id: string;
    createdAt: string;
    updatedAt: string;
}

interface PatientResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    birthDate: string;
    bloodType: string;
    person: {
        id: string;
        name: string;
        cpf: string;
        dType: string;
        phone: string | null;
        userId: string | null;
        gender: string;
    }
}

class PatientService {
    private transformResponse(data: PatientResponse): Patient {
        return {
            id: data.id,
            name: data.person.name,
            cpf: data.person.cpf,
            gender: data.person.gender,
            phone: data.person.phone || undefined,
            birthDate: data.birthDate,
            bloodType: data.bloodType,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }

    async getAll(): Promise<Patient[]> {
        const response = await axios.get(API_URL);
        return response.data.map(this.transformResponse);
    }

    async getById(id: string): Promise<Patient> {
        const response = await axios.get(`${API_URL}/${id}`);
        return this.transformResponse(response.data);
    }

    async create(data: PatientInput): Promise<Patient> {
        try {
            const response = await axios.post(API_URL, data);
            return this.transformResponse(response.data);
        } catch (error: any) {
            console.error('Erro ao criar paciente:', error.response?.data || error.message);
            throw error;
        }
    }

    async update(id: string, data: PatientInput): Promise<Patient> {
        try {
            const response = await axios.put(`${API_URL}/${id}`, data);
            return this.transformResponse(response.data);
        } catch (error: any) {
            console.error('Erro ao atualizar paciente:', error.response?.data || error.message);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        await axios.delete(`${API_URL}/${id}`);
    }
}

export default new PatientService();