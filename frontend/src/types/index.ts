// Client types
export type ClientSource = 'LINKEDIN' | 'WHATSAPP' | 'REFERRAL' | 'WEBSITE' | 'OTHER';
export type ClientStatus = 'PROSPECT' | 'IN_PREP' | 'INTERVIEWED' | 'PLACED';
export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: ClientSource;
  status: ClientStatus;
  notes?: string;
  school?: string;
  assignedToId?: string;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
  payments?: Payment[];
  _count?: { appointments: number; payments: number };
}
// Appointment types
export type AppointmentType =
  | 'ONLINE_COACHING'
  | 'TECH_PREP'
  | 'HR_PREP'
  | 'COMM_PREP'
  | 'MOCK_INTERVIEW'
  | 'CV_OPTIM'
  | 'LINKEDIN_OPTIM';
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  duration: number;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  meetLink?: string | null;
  createdAt: string;
  client?: { id: string; name: string; phone: string };
  payments?: Payment[];
}
// Payment types
export type PaymentMethod = 'TRANSFER' | 'CASH' | 'WHATSAPP' | 'OTHER';
export type PaymentStatus = 'PAID' | 'PENDING';
export interface Payment {
  id: string;
  clientId: string;
  appointmentId?: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  label: string;
  createdAt: string;
  client?: { id: string; name: string };
  appointment?: { id: string; type: string; date: string };
}
// Dashboard types
export interface DashboardStats {
  monthRevenue: number;
  upcomingCount: number;
  activeClients: number;
  todayCount: number;
  upcomingAppointments: Appointment[];
}
export interface RevenueChartData {
  month: string;
  revenue: number;
}
// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
