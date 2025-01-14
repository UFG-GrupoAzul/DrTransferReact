import { BaseService } from './baseService';

export interface DoctorInput {
    name: string;
    cpf: string;
    phone: string;
    registration: string;
    crm: string;
    gender: string;
}

export interface Doctor {
    id: string;
    crm: string;
    registration: string;
    cpf: string;
    phone: string;
    name: string;
    gender: string;
}

class DoctorService extends BaseService<Doctor> {
    constructor() {
        super('/doctors');
    }

    async createDoctor(data: DoctorInput): Promise<Doctor> {
        return this.create({
            crm: data.crm.trim(),
            registration: data.registration.trim(),
            name: data.name.trim(),
            cpf: data.cpf.trim(),
            gender: data.gender,
            phone: data.phone?.trim() || ''
        });
    }

    async updateDoctor(id: string, data: DoctorInput): Promise<Doctor> {
        return this.update(id, {
            crm: data.crm.trim(),
            registration: data.registration.trim(),
            name: data.name.trim(),
            cpf: data.cpf.trim(),
            gender: data.gender,
            phone: data.phone?.trim() || ''
        });
    }
}

export default new DoctorService(); 