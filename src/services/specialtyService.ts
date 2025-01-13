import { BaseService } from './baseService';

export interface Specialty {
  id: number;
  name: string;
  description: string;
}

class SpecialtyService extends BaseService<Specialty> {
  constructor() {
    super('/specialties');
  }
}

export default new SpecialtyService(); 