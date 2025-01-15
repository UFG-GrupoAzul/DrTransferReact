import { BaseService } from './baseService';
import patientService from './patientService';
import specialtyService from './specialtyService';

export interface RequestInput {
    patientId: string;
    specialtyId: string;
    classification: string;
}

interface RequestResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    patientId: string;
    specialtyId: string;
    classification: string;
}

export interface Request extends RequestResponse {
    patient?: any;
    specialty?: any;
}

class RequestService extends BaseService<RequestInput> {
    constructor() {
        super('/requests');
    }

    private async enrichResponse(data: RequestResponse): Promise<Request> {
        const [patient, specialty] = await Promise.all([
            patientService.getById(data.patientId),
            specialtyService.getById(data.specialtyId)
        ]);
        return {
            ...data,
            patient,
            specialty
        };
    }

    async getAll(): Promise<Request[]> {
        const response = await super.getAll();
        return Promise.all(response.map(this.enrichResponse.bind(this)));
    }

    async createRequest(data: RequestInput): Promise<Request> {
        const response = await this.create(data);
        return this.enrichResponse(response);
    }

    async updateRequest(id: string, data: RequestInput): Promise<Request> {
        const response = await this.update(id, data);
        return this.enrichResponse(response);
    }

    async delete(id: string): Promise<void> {
        await super.delete(id);
    }
}

export default new RequestService(); 