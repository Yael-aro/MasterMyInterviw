import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Edit2, Trash2, Phone, Mail, Calendar,
  CreditCard, Plus, User, MessageSquare
} from 'lucide-react';
import { getClient, updateClient, deleteClient } from '../api/clients';
import { ClientStatusStepper } from '../components/clients/ClientStatusStepper';
import { ClientForm } from '../components/clients/ClientForm';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import { PaymentForm } from '../components/payments/PaymentForm';
import { createAppointment } from '../api/appointments';
import { createPayment } from '../api/payments';
import { getClients } from '../api/clients';
import type { ClientStatus, AppointmentType, AppointmentStatus } from '../types';
import {
  CLIENT_STATUS_LABELS,
  CLIENT_SOURCE_LABELS,
  APPOINTMENT_TYPE_LABELS,
  APPOINTMENT_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from '../utils/labels';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEditForm, setShowEditForm] = useState(false);
  const [showApptForm, setShowApptForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => getClient(id!),
    enabled: !!id,
  });

  const { data: allClientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients({ limit: 100 } as Parameters<typeof getClients>[0]),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<typeof client>) => updateClient(id!, data as Parameters<typeof updateClient>[1]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      setShowEditForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteClient(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      navigate('/clients');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: ClientStatus) => updateClient(id!, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['client', id] }),
  });

  const createApptMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      setShowApptForm(false);
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      setShowPaymentForm(false);
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="h-8 w-32 skeleton rounded-lg mb-6" />
        <div className="card h-48 skeleton mb-4" />
        <div className="card h-64 skeleton" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-cream-muted">Client introuvable.</p>
        <Link to="/clients" className="btn-primary mt-4 inline-flex">Retour aux clients</Link>
      </div>
    );
  }

  const appointments = client.appointments || [];
  const payments = client.payments || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/clients')} className="flex items-center gap-2 text-cream-muted hover:text-cream text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Retour aux clients
      </button>

      {/* Client Header Card */}
      <div className="card p-6 mb-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center shrink-0">
              <span className="text-gold font-bold text-xl">{client.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold text-cream mb-1">{client.name}</h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-cream-muted">
                <span className="flex items-center gap-1.5"><Phone size={13} />{client.phone}</span>
                {client.email && <span className="flex items-center gap-1.5"><Mail size={13} />{client.email}</span>}
                <span className="text-cream-subtle">{CLIENT_SOURCE_LABELS[client.source as keyof typeof CLIENT_SOURCE_LABELS]}</span>
              </div>
              <p className="text-xs text-cream-subtle mt-1">
                Client depuis le {format(new Date(client.createdAt), 'd MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button onClick={() => setShowEditForm(true)} className="btn-icon" title="Modifier">
              <Edit2 size={16} />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-icon hover:text-error" title="Supprimer">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Status Stepper — Signature Element */}
        <div className="border-t border-border pt-5">
          <p className="text-xs text-cream-muted uppercase tracking-wider mb-4">Parcours client</p>
          <ClientStatusStepper
            status={client.status as ClientStatus}
            onChange={(status) => statusMutation.mutate(status)}
          />
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="card p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={15} className="text-gold" />
            <h2 className="font-serif text-base font-semibold text-cream">Notes</h2>
          </div>
          <p className="text-sm text-cream-muted leading-relaxed whitespace-pre-wrap">{client.notes}</p>
        </div>
      )}

      {/* Appointments */}
      <div className="card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-gold" />
            <h2 className="font-serif text-base font-semibold text-cream">
              Rendez-vous ({appointments.length})
            </h2>
          </div>
          <button
            onClick={() => setShowApptForm(true)}
            className="btn-ghost text-sm flex items-center gap-1"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {appointments.length === 0 ? (
          <p className="text-cream-subtle text-sm text-center py-6">Aucun rendez-vous enregistré</p>
        ) : (
          <div className="space-y-2">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-cream font-medium">
                    {APPOINTMENT_TYPE_LABELS[appt.type as AppointmentType]}
                  </p>
                  <p className="text-xs text-cream-muted">
                    {format(new Date(appt.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })} · {appt.duration} min
                  </p>
                </div>
                <span className={APPOINTMENT_STATUS_STYLES[appt.status as AppointmentStatus]}>
                  {appt.status === 'SCHEDULED' ? 'Prévu' : appt.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payments */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard size={15} className="text-gold" />
            <h2 className="font-serif text-base font-semibold text-cream">
              Paiements ({payments.length})
            </h2>
          </div>
          <button
            onClick={() => setShowPaymentForm(true)}
            className="btn-ghost text-sm flex items-center gap-1"
          >
            <Plus size={14} /> Ajouter
          </button>
        </div>

        {payments.length === 0 ? (
          <p className="text-cream-subtle text-sm text-center py-6">Aucun paiement enregistré</p>
        ) : (
          <div className="space-y-2">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                <div>
                  <p className="text-sm text-cream font-medium">{payment.label}</p>
                  <p className="text-xs text-cream-muted">
                    {format(new Date(payment.date), "d MMMM yyyy", { locale: fr })} · {PAYMENT_METHOD_LABELS[payment.method as keyof typeof PAYMENT_METHOD_LABELS]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-cream font-semibold">
                    {payment.amount.toLocaleString('fr-MA')} MAD
                  </span>
                  <span className={PAYMENT_STATUS_STYLES[payment.status as keyof typeof PAYMENT_STATUS_STYLES]}>
                    {PAYMENT_STATUS_LABELS[payment.status as keyof typeof PAYMENT_STATUS_LABELS]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showEditForm && (
        <ClientForm
          client={client}
          onSubmit={async (data) => { await updateMutation.mutateAsync(data); }}
          onClose={() => setShowEditForm(false)}
          isLoading={updateMutation.isPending}
        />
      )}

      {showApptForm && (
        <AppointmentForm
          clients={allClientsData?.clients || [client]}
          defaultClientId={client.id}
          onSubmit={async (data) => { await createApptMutation.mutateAsync(data); }}
          onClose={() => setShowApptForm(false)}
          isLoading={createApptMutation.isPending}
        />
      )}

      {showPaymentForm && (
        <PaymentForm
          clients={allClientsData?.clients || [client]}
          appointments={client.appointments}
          defaultClientId={client.id}
          onSubmit={async (data) => { await createPaymentMutation.mutateAsync(data); }}
          onClose={() => setShowPaymentForm(false)}
          isLoading={createPaymentMutation.isPending}
        />
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg text-cream mb-2">Supprimer {client.name} ?</h3>
            <p className="text-cream-muted text-sm mb-6">
              Cette action supprimera également tous les rendez-vous et paiements associés. Elle est irréversible.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">Annuler</button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="btn-danger flex-1"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
