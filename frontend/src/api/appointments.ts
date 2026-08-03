import api from './axios';
import type { Appointment } from '../types';

export const getAppointments = async (params?: {
  clientId?: string;
  status?: string;
  from?: string;
  to?: string;
}) => {
  const { data } = await api.get('/appointments', { params });
  return data as Appointment[];
};

export const getAppointment = async (id: string) => {
  const { data } = await api.get(`/appointments/${id}`);
  return data as Appointment;
};

export const createAppointment = async (payload: Partial<Appointment>) => {
  const { data } = await api.post('/appointments', payload);
  return data as Appointment;
};

export const updateAppointment = async (id: string, payload: Partial<Appointment>) => {
  const { data } = await api.put(`/appointments/${id}`, payload);
  return data as Appointment;
};

export const deleteAppointment = async (id: string) => {
  await api.delete(`/appointments/${id}`);
};
