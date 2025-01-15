import axios from 'axios';
import { API_CONFIG } from '../config/api';

export class BaseService<T> {
  constructor(private path: string) {}

  private getUrl(id?: string) {
    return `${API_CONFIG.baseURL}${this.path}${id ? `/${id}` : ''}`;
  }

  async getAll() {
    const response = await axios.get(this.getUrl());
    return response.data;
  }

  async get(id: string) {
    const response = await axios.get(this.getUrl(id));
    return response.data;
  }

  async create(data: Omit<T, 'id'>) {
    const response = await axios.post(this.getUrl(), data);
    return response.data;
  }

  async update(id: string, data: Omit<T, 'id'>) {
    const response = await axios.put(this.getUrl(id), data);
    return response.data;
  }

  async delete(id: string) {
    const response = await axios.delete(this.getUrl(id));
    return response.data;
  }
} 