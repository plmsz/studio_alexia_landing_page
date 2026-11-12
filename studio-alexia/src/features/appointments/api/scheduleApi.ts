import axios from 'axios';
import type { BusinessHours, BlockedDate } from '../../../shared/types';

const api = axios.create({
  baseURL: '/api',
});

export const businessHoursApi = {
  getAll: async (): Promise<BusinessHours[]> => {
    const response = await api.get<BusinessHours[]>('/businessHours');
    return response.data;
  },
  update: async (id: number, hours: Partial<BusinessHours>): Promise<BusinessHours> => {
    const response = await api.patch<BusinessHours>(`/businessHours/${id}`, hours);
    return response.data;
  },
};

export const blockedDatesApi = {
  getAll: async (): Promise<BlockedDate[]> => {
    const response = await api.get<BlockedDate[]>('/blockedDates');
    return response.data;
  },
  create: async (blockedDate: Omit<BlockedDate, 'id'>): Promise<BlockedDate> => {
    const response = await api.post<BlockedDate>('/blockedDates', blockedDate);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/blockedDates/${id}`);
  },
};
