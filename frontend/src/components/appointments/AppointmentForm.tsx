import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Appointment, AppointmentType, AppointmentStatus, Client } from '../../types';
import { APPOINTMENT_TYPE_LABELS } from '../../utils/labels';

const schema = z.object({
  clientId: z.string().min(1, 'Client requis'),
  date: z.string().min(1, 'Date requise'),
  time: z.string().min(1, 'Heure requise'),
  duration: z.number().min(15).max(240),
  type: z.enum(['ONLINE_COACHING', 'TECH_PREP', 'HR_PREP', 'COMM_PREP', 'MOCK_INTERVIEW', 'CV_OPTIM', 'LINKEDIN_OPTIM']),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AppointmentFormProps {
  appointment?: Partial<Appointment>;
  clients: Client[];
  onSubmit: (data: { clientId: string; date: string; duration: number; type: AppointmentType; status: AppointmentStatus; notes?: string }) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  defaultClientId?: string;
}

const typeOptions = Object.entries(APPOINTMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }));

const durationOptions = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
];

export const AppointmentForm = ({
  appointment,
  clients,
  onSubmit,
  onClose,
  isLoading,
  defaultClientId,
}: AppointmentFormProps) => {
  const isEdit = !!appointment?.id;

  const defaultDate = appointment?.date
    ? new Date(appointment.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const defaultTime = appointment?.date
    ? new Date(appointment.date).toTimeString().slice(0, 5)
    : '10:00';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: appointment?.clientId || defaultClientId || '',
      date: defaultDate,
      time: defaultTime,
      duration: appointment?.duration || 60,
      type: (appointment?.type as AppointmentType) || 'ONLINE_COACHING',
      status: (appointment?.status as AppointmentStatus) || 'SCHEDULED',
      notes: appointment?.notes || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    const dateTime = new Date(`${data.date}T${data.time}:00`).toISOString();
    await onSubmit({
      clientId: data.clientId,
      date: dateTime,
      duration: data.duration,
      type: data.type as AppointmentType,
      status: data.status as AppointmentStatus,
      notes: data.notes,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-cream">
            {isEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
          </h2>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div>
            <label className="label">Client *</label>
            <select {...register('clientId')} className="input">
              <option value="">Sélectionner un client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.clientId && <p className="text-error text-xs mt-1">{errors.clientId.message}</p>}
          </div>

          <div>
            <label className="label">Type de séance *</label>
            <select {...register('type')} className="input">
              {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date *</label>
              <input {...register('date')} type="date" className="input" />
              {errors.date && <p className="text-error text-xs mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="label">Heure *</label>
              <input {...register('time')} type="time" className="input" />
              {errors.time && <p className="text-error text-xs mt-1">{errors.time.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Durée</label>
              <select {...register('duration', { valueAsNumber: true })} className="input">
                {durationOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select {...register('status')} className="input">
                <option value="SCHEDULED">Prévu</option>
                <option value="COMPLETED">Terminé</option>
                <option value="CANCELLED">Annulé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea {...register('notes')} rows={3} className="input resize-none" placeholder="Objectifs de la séance, points abordés..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
