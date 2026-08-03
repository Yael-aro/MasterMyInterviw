import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Filter, Users, ChevronRight, Phone, Mail } from 'lucide-react';
import { getClients, createClient, deleteClient } from '../api/clients';
import { ClientForm } from '../components/clients/ClientForm';
import { ClientStatusStepper } from '../components/clients/ClientStatusStepper';
import type { Client, ClientStatus } from '../types';
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_BADGE,
  CLIENT_SOURCE_LABELS,
} from '../utils/labels';

const statusFilters: { value: string; label: string }[] = [
  { value: '', label: 'Tous' },
  { value: 'PROSPECT', label: 'Prospects' },
  { value: 'IN_PREP', label: 'En préparation' },
  { value: 'INTERVIEWED', label: 'Entretien passé' },
  { value: 'PLACED', label: 'Placés' },
];

export const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, statusFilter],
    queryFn: () => getClients({ search: search || undefined, status: statusFilter || undefined }),
    staleTime: 30000,
  });

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteId(null);
    },
  });

  const clients = data?.clients || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="text-cream-muted text-sm mt-1">
            {data?.total || 0} client{(data?.total || 0) > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">Nouveau client</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
              placeholder="Rechercher par nom, téléphone ou email..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(f => (
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
      </div>

      {/* Client List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card h-24 skeleton" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="card p-16 text-center">
          <Users size={48} className="text-cream-subtle mx-auto mb-4" />
          <h3 className="font-serif text-lg text-cream mb-2">Aucun client trouvé</h3>
          <p className="text-cream-muted text-sm mb-6">
            {search || statusFilter ? 'Essayez d\'autres filtres' : 'Commencez par ajouter votre premier client'}
          </p>
          {!search && !statusFilter && (
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={16} className="inline mr-2" />Nouveau client
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((client) => (
            <div key={client.id} className="card p-4 hover:border-border-light transition-all duration-200 group">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-gold font-semibold text-sm">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Link
                        to={`/clients/${client.id}`}
                        className="font-medium text-cream hover:text-gold transition-colors"
                      >
                        {client.name}
                      </Link>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-cream-muted">
                          <Phone size={11} /> {client.phone}
                        </span>
                        {client.email && (
                          <span className="flex items-center gap-1 text-xs text-cream-muted">
                            <Mail size={11} /> {client.email}
                          </span>
                        )}
                        <span className="text-xs text-cream-subtle">
                          {CLIENT_SOURCE_LABELS[client.source as keyof typeof CLIENT_SOURCE_LABELS]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`${CLIENT_STATUS_BADGE[client.status as ClientStatus]}`}>
                        {CLIENT_STATUS_LABELS[client.status as ClientStatus]}
                      </span>
                      <Link to={`/clients/${client.id}`} className="btn-icon opacity-0 group-hover:opacity-100">
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Mini stepper */}
                  <div className="mt-3">
                    <ClientStatusStepper status={client.status as ClientStatus} readonly />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <ClientForm
          onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="font-serif text-lg text-cream mb-2">Supprimer ce client ?</h3>
            <p className="text-cream-muted text-sm mb-6">
              Cette action supprimera également tous les rendez-vous et paiements associés.
            </p>
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
