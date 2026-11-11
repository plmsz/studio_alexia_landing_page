import axios from 'axios';
import type { Appointment } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const appointmentsApi = {
  getAll: async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments');
    return response.data.map(apt => ({
      ...apt,
      startTime: new Date(apt.startTime),
      endTime: new Date(apt.endTime)
    }));
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return {
      ...response.data,
      startTime: new Date(response.data.startTime),
      endTime: new Date(response.data.endTime)
    };
  },

  getByDate: async (date: string): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(`/appointments?date=${date}`);
    return response.data.map(apt => ({
      ...apt,
      startTime: new Date(apt.startTime),
      endTime: new Date(apt.endTime)
    }));
  },

  create: async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', appointment);
    return {
      ...response.data,
      startTime: new Date(response.data.startTime),
      endTime: new Date(response.data.endTime)
    };
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, appointment);
    return {
      ...response.data,
      startTime: new Date(response.data.startTime),
      endTime: new Date(response.data.endTime)
    };
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  }
};
