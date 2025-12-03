import axios from 'axios';
import type { Service } from '../types/service';
import type { Appointment } from '../types/appointment';

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
