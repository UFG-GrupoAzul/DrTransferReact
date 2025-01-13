import axios from 'axios';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  availableBeds: number;
}

const API_URL = 'http://localhost:3000/hospitals';

class HospitalService {
  async getAll(): Promise<Hospital[]> {
    const response = await axios.get(API_URL);
    return response.data;
  }
}

export default new HospitalService(); 