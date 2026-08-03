import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, Check, X, Clock, Filter } from 'lucide-react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import { getClients } from '../api/clients';
import { AppointmentForm } from '../components/appointments/AppointmentForm';
import type { Appointment, AppointmentType, AppointmentStatus } from '../types';
import {
  APPOINTMENT_TYPE_LABELS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_STYLES,
} from '../utils/labels';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const statusFilters = [
  { value: '', label: 'Tous' },
  { value: 'SCHEDULED', label: 'Prévus' },
  { value: 'COMPLETED', label: 'Terminés' },
  { value: 'CANCELLED', label: 'Annulés' },
];

const getDayLabel = (date: Date) => {
  if (isToday(date)) return '🔴 Aujourd\'hui';
  if (isTomorrow(date)) return '🟡 Demain';
  if (isThisWeek(date)) return '📅 Cette semaine';
  return format(date, 'EEEE d MMMM yyyy', { locale: fr });
};

export const AppointmentsPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('SCHEDULED');
  const [showForm, setShowForm] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', statusFilter],
    queryFn: () => getAppointments({ status: statusFilter || undefined }),
    staleTime: 30000,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => getClients({ limit: 100 } as Parameters<typeof getClients>[0]),
  });
  const clients = clientsData?.clients || [];

  const createMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); setShowForm(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => updateAppointment(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); setEditAppt(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  const quickStatus = (id: string, status: AppointmentStatus) => {
    updateMutation.mutate({ id, data: { status } });
  };

  // Group by date
  const grouped = appointments.reduce((acc, appt) => {
    const date = new Date(appt.date);
    const key = format(date, 'yyyy-MM-dd');
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDays = Object.keys(grouped).sort();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Rendez-vous</h1>
          <p className="text-cream-muted text-sm mt-1">{appointments.length} rendez-vous</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span className="hidden sm:inline">Nouveau RDV</span>
        </button>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === f.value
                ? 'bg-gold text-bg-primary'
                : 'bg-bg-surface text-cream-muted border border-border hover:text-cream hover:border-border-light'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Calendar grouped list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-32 skeleton" />
          ))}
        </div>
      ) : sortedDays.length === 0 ? (
        <div className="card p-16 text-center">
          <Calendar size={48} className="text-cream-subtle mx-auto mb-4" />
          <h3 className="font-serif text-lg text-cream mb-2">Aucun rendez-vous</h3>
          <p className="text-cream-muted text-sm mb-6">
            {statusFilter ? `Aucun rendez-vous ${APPOINTMENT_STATUS_LABELS[statusFilter as AppointmentStatus]?.toLowerCase()}` : 'Commencez par créer un rendez-vous'}
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={16} className="inline mr-2" />Nouveau rendez-vous
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDays.map((dayKey) => {
            const dayDate = new Date(dayKey + 'T12:00:00');
            const dayAppts = grouped[dayKey];
            const isTodayDay = isToday(dayDate);

            return (
              <div key={dayKey}>
                <div className={`flex items-center gap-3 mb-3 ${isTodayDay ? 'text-gold' : 'text-cream-muted'}`}>
                  <div className={`w-2 h-2 rounded-full ${isTodayDay ? 'bg-gold animate-pulse' : 'bg-border'}`} />
                  <h2 className={`text-sm font-semibold uppercase tracking-wide ${isTodayDay ? 'text-gold' : 'text-cream-muted'}`}>
                    {getDayLabel(dayDate)}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-cream-subtle font-mono">{dayAppts.length} RDV</span>
                </div>

                <div className="space-y-3">
                  {dayAppts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((appt) => (
                    <div
                      key={appt.id}
                      className={`card p-4 transition-all duration-200 hover:border-border-light ${
                        isTodayDay && appt.status === 'SCHEDULED' ? 'border-gold/20 bg-gold/3' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Time */}
                        <div className="shrink-0 text-center w-14">
                          <p className={`font-mono text-xl font-semibold ${isTodayDay && appt.status === 'SCHEDULED' ? 'text-gold' : 'text-cream'}`}>
                            {format(new Date(appt.date), 'HH:mm')}
                          </p>
                          <p className="text-2xs text-cream-muted">{appt.duration} min</p>
                        </div>

                        <div className="w-px self-stretch bg-border" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <Link
                              to={`/clients/${appt.clientId}`}
                              className="text-sm font-medium text-cream hover:text-gold transition-colors"
                            >
                              {appt.client?.name || 'Client'}
                            </Link>
                            <span className={APPOINTMENT_STATUS_STYLES[appt.status as AppointmentStatus]}>
                              {APPOINTMENT_STATUS_LABELS[appt.status as AppointmentStatus]}
                            </span>
                          </div>
                          <p className="text-xs text-cream-muted">
                            {APPOINTMENT_TYPE_LABELS[appt.type as AppointmentType]}
                          </p>
                          {appt.notes && (
                            <p className="text-xs text-cream-subtle mt-1 line-clamp-1">{appt.notes}</p>
                          )}
                        </div>

                        {/* Actions */}
                        {appt.status === 'SCHEDULED' && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => quickStatus(appt.id, 'COMPLETED')}
                              className="w-8 h-8 rounded-lg bg-success/10 text-success hover:bg-success/20 flex items-center justify-center transition-colors"
                              title="Marquer comme terminé"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => quickStatus(appt.id, 'CANCELLED')}
                              className="w-8 h-8 rounded-lg bg-error/10 text-error hover:bg-error/20 flex items-center justify-center transition-colors"
                              title="Annuler"
                            >
                              <X size={14} />
                            </button>
                            <button
                              onClick={() => setEditAppt(appt)}
                              className="w-8 h-8 rounded-lg bg-bg-secondary text-cream-muted hover:text-cream flex items-center justify-center transition-colors"
                              title="Modifier"
                            >
                              <Clock size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <AppointmentForm
          clients={clients}
          onSubmit={async (data) => { await createMutation.mutateAsync(data); }}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}

      {editAppt && (
        <AppointmentForm
          appointment={editAppt}
          clients={clients}
          onSubmit={async (data) => { await updateMutation.mutateAsync({ id: editAppt.id, data }); }}
          onClose={() => setEditAppt(null)}
          isLoading={updateMutation.isPending}
        />
      )}
    </div>
  );
};
