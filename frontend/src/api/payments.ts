import api from './axios';
import type { Payment } from '../types';

export const getPayments = async (params?: {
  clientId?: string;
  status?: string;
  from?: string;
  to?: string;
}) => {
  const { data } = await api.get('/payments', { params });
  return data as { payments: Payment[]; totalPaid: number; totalPending: number };
};

export const createPayment = async (payload: Partial<Payment>) => {
  const { data } = await api.post('/payments', payload);
  return data as Payment;
};

export const updatePayment = async (id: string, payload: Partial<Payment>) => {
  const { data } = await api.put(`/payments/${id}`, payload);
  return data as Payment;
};

export const deletePayment = async (id: string) => {
  await api.delete(`/payments/${id}`);
};
