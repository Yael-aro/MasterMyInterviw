import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CreditCard, TrendingUp, Clock, Pencil, Trash2 } from 'lucide-react';
import { getPayments, createPayment, updatePayment, deletePayment } from '../api/payments';
import { getClients } from '../api/clients';
import { getAppointments } from '../api/appointments';
import { PaymentForm } from '../components/payments/PaymentForm';
import type { Payment } from '../types';
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_STYLES } from '../utils/labels';

const statusFilters: { value: string; label: string }[] = [
  { value: '', label: 'Tous' },
  { value: 'PAID', label: 'Payés' },
  { value: 'PENDING', label: 'En attente' },
];

export const PaymentsPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Payment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['payments', statusFilter],
    queryFn: () => getPayments({ status: statusFilter || undefined }),
    staleTime: 30000,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients', 'all'],
    queryFn: () => getClients({}),
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments', 'all'],
    queryFn: () => getAppointments({}),
  });

  const createMutation = useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Payment> }) =>
      updatePayment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setDeleteId(null);
    },
  });

  const payments = data?.payments || [];
  const clients = clientsData?.clients || [];
  const appointments = appointmentsData?.appointments || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Paiements</h1>
          <p className="text-cream-muted text-sm mt-1">
            Suivi des encaissements et paiements en attente
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">Nouveau paiement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-cream-muted text-xs mb-2">
            <TrendingUp size={14} /> Total encaissé
          </div>
          <p className="font-mono text-2xl text-cream font-semibold">
            {(data?.totalPaid || 0).toLocaleString('fr-FR')} MAD
          </p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-cream-muted text-xs mb-2">
            <Clock size={14} /> En attente
          </div>
          <p className="font-mono text-2xl text-gold font-semibold">
            {(data?.totalPending || 0).toLocaleString('fr-FR')} MAD
          </p>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                statusFilter === f.value
                  ? 'bg-gold text-bg-primary'
                  : 'bg-bg-secondary text-cream-muted hover:text-cream hover:bg-bg-elevated'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-20 skeleton" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="card p-16 text-center">
          <CreditCard size={48} className="text-cream-subtle mx-auto mb-4" />
          <h3 className="font-serif text-lg text-cream mb-2">Aucun paiement trouvé</h3>
          <p className="text-cream-muted text-sm mb-6">
            {statusFilter ? "Essayez un autre filtre" : "Enregistrez votre premier paiement"}
          </p>
          {!statusFilter && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} className="inline mr-2" />Nouveau paiement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="card p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-cream">{payment.client?.name || 'Client'}</span>
                  <span className={PAYMENT_STATUS_STYLES[payment.status]}>
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </span>
                </div>
                <p className="text-sm text-cream-muted truncate">{payment.label}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-cream-subtle">
                  <span>{new Date(payment.date).toLocaleDateString('fr-FR')}</span>
                  <span>{PAYMENT_METHOD_LABELS[payment.method]}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-lg text-cream font-semibold">
                  {payment.amount.toLocaleString('fr-FR')} MAD
                </span>
                <button onClick={() => setEditing(payment)} className="btn-icon">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteId(payment.id)} className="btn-icon hover:text-error">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <PaymentForm
          payment={editing || undefined}
          clients={clients}
          appointments={appointments}
          onSubmit={async (formData) => {
            if (editing) {
              await updateMutation.mutateAsync({ id: editing.id, payload: formData });
            } else {
              await createMutation.mutateAsync(formData);
            }
          }}
          onClose={() => { setShowForm(false); setEditing(null); }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg text-cream mb-2">Supprimer ce paiement ?</h3>
            <p className="text-cream-muted text-sm mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Annuler</button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="btn-danger flex-1"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;