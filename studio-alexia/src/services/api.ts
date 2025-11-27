import axios from 'axios';
import type { Service } from '../types/service';

const api = axios.create({
  baseURL: '/api'
});

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },

  getById: async (id: number): Promise<Service> => {
    const response = await api.get<Service>(`/services/${id}`);
    return response.data;
  },

  getFeatured: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services?featured=true');
    return response.data;
  },

  create: async (service: Omit<Service, 'id'>): Promise<Service> => {
    const response = await api.post<Service>('/services', service);
    return response.data;
  },

  update: async (id: number, service: Partial<Service>): Promise<Service> => {
    const response = await api.put<Service>(`/services/${id}`, service);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  }
};
