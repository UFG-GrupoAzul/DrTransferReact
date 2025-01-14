import { BaseService } from './baseService';

export interface RegulatoryDoctorInput {
    name: string;
    cpf: string;
    phone: string;
    crm: string;
    insurance: string;
    gender: string;
}

interface RegulatoryDoctorResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    crm: string;
    insurance: string;
    person: {
        id: string;
        name: string;
        cpf: string;
        dType: string;
        phone: string;
        userId: string | null;
        gender: string;
    }
}

export interface RegulatoryDoctor extends RegulatoryDoctorInput {
    id: string;
}

class RegulatoryDoctorService extends BaseService<RegulatoryDoctorInput> {
    constructor() {
        super('/regulatoryDoctors');
    }

    private transformResponse(data: RegulatoryDoctorResponse): RegulatoryDoctor {
        return {
            id: data.id,
            crm: data.crm,
            insurance: data.insurance,
            name: data.person.name,
            cpf: data.person.cpf,
            gender: data.person.gender,
            phone: data.person.phone
        };
    }

    async getAll(): Promise<RegulatoryDoctor[]> {
        const response = await super.getAll();
        return response.map(this.transformResponse);
    }

    async createRegulatoryDoctor(data: RegulatoryDoctorInput): Promise<RegulatoryDoctor> {
        const response = await this.create(data);
        return this.transformResponse(response);
    }

    async updateRegulatoryDoctor(id: string, data: RegulatoryDoctorInput): Promise<RegulatoryDoctor> {
        const response = await this.update(id, data);
        return this.transformResponse(response);
    }

    async delete(id: string): Promise<void> {
        await super.delete(id);
    }
}

export default new RegulatoryDoctorService(); 