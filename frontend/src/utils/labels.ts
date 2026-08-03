import type { ClientStatus, ClientSource, AppointmentType, AppointmentStatus, PaymentMethod, PaymentStatus } from '../types';

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  PROSPECT: 'Prospect',
  IN_PREP: 'En préparation',
  INTERVIEWED: 'Entretien passé',
  PLACED: 'Placé',
};

export const CLIENT_STATUS_STEPS: { key: ClientStatus; label: string; short: string }[] = [
  { key: 'PROSPECT', label: 'Prospect', short: 'Prospect' },
  { key: 'IN_PREP', label: 'En préparation', short: 'Préparation' },
  { key: 'INTERVIEWED', label: 'Entretien passé', short: 'Entretien' },
  { key: 'PLACED', label: 'Placé', short: 'Placé ✓' },
];

export const CLIENT_STATUS_BADGE: Record<ClientStatus, string> = {
  PROSPECT: 'badge-muted',
  IN_PREP: 'badge-blue',
  INTERVIEWED: 'badge-gold',
  PLACED: 'badge-green',
};

export const CLIENT_SOURCE_LABELS: Record<ClientSource, string> = {
  LINKEDIN: 'LinkedIn',
  WHATSAPP: 'WhatsApp',
  REFERRAL: 'Recommandation',
  OTHER: 'Autre',
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  ONLINE_COACHING: 'Coaching en ligne',
  TECH_PREP: 'Préparation technique',
  HR_PREP: 'Préparation RH',
  COMM_PREP: 'Préparation communication',
  MOCK_INTERVIEW: 'Simulation d\'entretien',
  CV_OPTIM: 'Optimisation CV',
  LINKEDIN_OPTIM: 'Optimisation LinkedIn',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: 'Prévu',
  COMPLETED: 'Terminé',
  CANCELLED: 'Annulé',
};

export const APPOINTMENT_STATUS_STYLES: Record<AppointmentStatus, string> = {
  SCHEDULED: 'badge-blue',
  COMPLETED: 'badge-green',
  CANCELLED: 'badge-red',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  TRANSFER: 'Virement',
  CASH: 'Espèces',
  WHATSAPP: 'WhatsApp Pay',
  OTHER: 'Autre',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: 'Payé',
  PENDING: 'En attente',
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PAID: 'badge-green',
  PENDING: 'badge-gold',
};
