import { BaseService } from './baseService';

export interface DoctorInput {
    name: string;
    cpf: string;
    phone: string;
    crm: string;
    registration: string;
    gender: string;
}

export interface Doctor extends DoctorInput {
    id: string;
}

interface DoctorResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    crm: string;
    Employee: {
        registration: string;
        person: {
            name: string;
            cpf: string;
            phone: string;
            gender: string;
        }
    }
}

class DoctorService extends BaseService<DoctorInput> {
    constructor() {
        super('/doctors');
    }

    private transformResponse(data: DoctorResponse): Doctor {
        return {
            id: data.id,
            name: data.Employee.person.name,
            cpf: data.Employee.person.cpf,
            phone: data.Employee.person.phone,
            gender: data.Employee.person.gender,
            crm: data.crm,
            registration: data.Employee.registration
        };
    }

    async getAll(): Promise<Doctor[]> {
        const response = await super.getAll();
        return response.map(this.transformResponse);
    }

    async getById(id: string): Promise<Doctor> {
        const response = await this.get(id);
        return this.transformResponse(response);
    }

    async createDoctor(data: DoctorInput): Promise<Doctor> {
        const response = await this.create(data);
        return this.transformResponse(response);
    }

    async updateDoctor(id: string, data: DoctorInput): Promise<Doctor> {
        const response = await this.update(id, data);
        return this.transformResponse(response);
    }
}

export default new DoctorService(); 