import api from './axios';
import type { Client } from '../types';

export const getClients = async (params?: { search?: string; status?: string; page?: number }) => {
  const { data } = await api.get('/clients', { params });
  return data as { clients: Client[]; total: number; page: number; limit: number };
};

export const getClient = async (id: string) => {
  const { data } = await api.get(`/clients/${id}`);
  return data as Client;
};

export const createClient = async (payload: Partial<Client>) => {
  const { data } = await api.post('/clients', payload);
  return data as Client;
};

export const updateClient = async (id: string, payload: Partial<Client>) => {
  const { data } = await api.put(`/clients/${id}`, payload);
  return data as Client;
};

export const deleteClient = async (id: string) => {
  await api.delete(`/clients/${id}`);
};
