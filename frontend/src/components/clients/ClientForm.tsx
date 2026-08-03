import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import type { Client, ClientSource, ClientStatus } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  phone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  source: z.enum(['LINKEDIN', 'WHATSAPP', 'REFERRAL', 'OTHER']),
  status: z.enum(['PROSPECT', 'IN_PREP', 'INTERVIEWED', 'PLACED']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ClientFormProps {
  client?: Partial<Client>;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const sourceOptions: { value: ClientSource; label: string }[] = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'REFERRAL', label: 'Recommandation' },
  { value: 'OTHER', label: 'Autre' },
];

const statusOptions: { value: ClientStatus; label: string }[] = [
  { value: 'PROSPECT', label: 'Prospect' },
  { value: 'IN_PREP', label: 'En préparation' },
  { value: 'INTERVIEWED', label: 'Entretien passé' },
  { value: 'PLACED', label: 'Placé' },
];

export const ClientForm = ({ client, onSubmit, onClose, isLoading }: ClientFormProps) => {
  const isEdit = !!client?.id;
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client?.name || '',
      phone: client?.phone || '',
      email: client?.email || '',
      source: (client?.source as ClientSource) || 'OTHER',
      status: (client?.status as ClientStatus) || 'PROSPECT',
      notes: client?.notes || '',
    },
  });

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-lg font-semibold text-cream">
            {isEdit ? 'Modifier le client' : 'Nouveau client'}
          </h2>
          <button onClick={onClose} className="btn-icon"><X size={18} /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nom complet *</label>
              <input {...register('name')} className="input" placeholder="Karim Benali" />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Téléphone *</label>
              <input {...register('phone')} className="input" placeholder="+212 6 xx xx xx xx" />
              {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" placeholder="client@email.com" />
            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Source</label>
              <select {...register('source')} className="input">
                {sourceOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Statut</label>
              <select {...register('status')} className="input">
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes libres</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input resize-none"
              placeholder="Objectifs, contexte, points à travailler..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
