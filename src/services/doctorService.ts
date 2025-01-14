import { BaseService } from './baseService';

export interface DoctorInput {
    name: string;
    cpf: string;
    phone: string;
    registration: string;
    crm: string;
    gender: string;
}

interface DoctorResponse {
    id: string;
    crm: string;
    Employee: {
        registration: string;
        person: {
            cpf: string;
            phone: string;
            name: string;
            gender: string;
        }
    }
}

export interface Doctor extends DoctorInput {
    id: string;
}

class DoctorService extends BaseService<DoctorInput> {
    constructor() {
        super('/doctors');
    }

    private transformResponse(data: DoctorResponse): Doctor {
        return {
            id: data.id,
            crm: data.crm,
            registration: data.Employee.registration,
            name: data.Employee.person.name,
            cpf: data.Employee.person.cpf,
            gender: data.Employee.person.gender,
            phone: data.Employee.person.phone
        };
    }


    async getAll(): Promise<Doctor[]> {
        const response = await super.getAll();
        return response.map(this.transformResponse);
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