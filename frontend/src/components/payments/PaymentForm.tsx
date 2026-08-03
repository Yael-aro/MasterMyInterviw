import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Payment, PaymentMethod, PaymentStatus, Client, Appointment } from '../../types';
import { PAYMENT_METHOD_LABELS } from '../../utils/labels';

const schema = z.object({
  clientId: z.string().min(1, 'Client requis'),
  appointmentId: z.string().optional(),
  amount: z.number({ invalid_type_error: 'Montant invalide' }).positive('Montant doit être positif'),
  method: z.enum(['TRANSFER', 'CASH', 'WHATSAPP', 'OTHER']),
  status: z.enum(['PAID', 'PENDING']),
  date: z.string().min(1, 'Date requise'),
  label: z.string().min(1, 'Libellé requis'),
});

type FormData = z.infer<typeof schema>;

interface PaymentFormProps {
  payment?: Partial<Payment>;
  clients: Client[];
  appointments?: Appointment[];
  onSubmit: (data: Partial<Payment>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  defaultClientId?: string;
}

const methodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label }));

export const PaymentForm = ({
  payment,
  clients,
  appointments = [],
  onSubmit,
  onClose,
  isLoading,
  defaultClientId,
}: PaymentFormProps) => {
  const isEdit = !!payment?.id;

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientId: payment?.clientId || defaultClientId || '',
      appointmentId: payment?.appointmentId || '',
      amount: payment?.amount || undefined,
      method: (payment?.method as PaymentMethod) || 'TRANSFER',
      status: (payment?.status as PaymentStatus) || 'PENDING',
      date: payment?.date
        ? new Date(payment.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      label: payment?.label || '',
    },
  });

  const selectedClientId = watch('clientId');
  const clientAppointments = appointments.filter(a => a.clientId === selectedClientId);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      appointmentId: data.appointmentId || undefined,
      date: new Date(data.date).toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-cream">
            {isEdit ? 'Modifier le paiement' : 'Enregistrer un paiement'}
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

          {clientAppointments.length > 0 && (
            <div>
              <label className="label">Lier à un rendez-vous (optionnel)</label>
              <select {...register('appointmentId')} className="input">
                <option value="">Aucun (forfait / autre)</option>
                {clientAppointments.map(a => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.date).toLocaleDateString('fr-FR')} — {a.type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Libellé *</label>
            <input {...register('label')} className="input" placeholder="ex: Séance coaching individuelle, Forfait 5 séances" />
            {errors.label && <p className="text-error text-xs mt-1">{errors.label.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Montant (MAD) *</label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input font-mono"
                placeholder="1200"
              />
              {errors.amount && <p className="text-error text-xs mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="label">Date *</label>
              <input {...register('date')} type="date" className="input" />
              {errors.date && <p className="text-error text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Méthode</label>
              <select {...register('method')} className="input">
                {methodOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select {...register('status')} className="input">
                <option value="PENDING">En attente</option>
                <option value="PAID">Payé</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
