import axios from 'axios';
import { API_CONFIG } from '../config/api';

const BASE_PATH = '/enums';

export interface EnumItem {
  id: string;
  value: string;
  label: string;
}

class EnumService {
  private formatPath(path: string): string {
    return `${API_CONFIG.baseURL}${BASE_PATH}/${path}`;
  }

  async getGenders(): Promise<EnumItem[]> {
    const response = await axios.get(this.formatPath('gender'));
    return response.data;
  }

  async getBloodTypes(): Promise<EnumItem[]> {
    const response = await axios.get(this.formatPath('bloodType'));
    return response.data;
  }

  async getClassifications(): Promise<EnumItem[]> {
    const response = await axios.get(this.formatPath('classification'));
    return response.data;
  }
}

export default new EnumService(); 