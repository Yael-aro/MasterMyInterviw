import api from './axios';

export interface BookingPayload {
  name: string;
  phone: string;
  email?: string;
  appointmentType: string;
  preferredPeriod?: string;
  message?: string;
  school?: string;
  applicationType?: string;
}

export const submitBooking = async (payload: BookingPayload) => {
  const { data } = await api.post('/public/booking', payload);
  return data as { success: boolean; message: string };
};