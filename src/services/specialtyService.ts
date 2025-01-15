import { BaseService } from './baseService';

export interface Specialty {
  id: string;
  name: string;
  description: string;
}

class SpecialtyService extends BaseService<Specialty> {
  constructor() {
    super('/specialties');
  }

  async getById(id: string): Promise<Specialty> {
    const response = await this.get(id);
    return response;
  }
}

export default new SpecialtyService(); 