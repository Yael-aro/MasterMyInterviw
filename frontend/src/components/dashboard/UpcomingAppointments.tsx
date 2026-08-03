import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Appointment } from '../../types';
import { APPOINTMENT_TYPE_LABELS, APPOINTMENT_STATUS_STYLES } from '../../utils/labels';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const getDayLabel = (date: Date) => {
  if (isToday(date)) return 'Aujourd\'hui';
  if (isTomorrow(date)) return 'Demain';
  return format(date, 'EEEE d MMMM', { locale: fr });
};

export const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  if (appointments.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="section-title mb-4">Prochains rendez-vous</h3>
        <div className="text-center py-10">
          <Calendar size={36} className="text-cream-subtle mx-auto mb-3" />
          <p className="text-cream-muted text-sm">Aucun rendez-vous à venir</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">Prochains rendez-vous</h3>
        <Link to="/appointments" className="text-xs text-gold hover:text-gold-light flex items-center gap-1 transition-colors">
          Voir tout <ChevronRight size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {appointments.map((appt) => {
          const date = new Date(appt.date);
          const dayLabel = getDayLabel(date);
          const today = isToday(date);

          return (
            <div
              key={appt.id}
              className={`flex items-center gap-4 p-3 rounded-lg border transition-all duration-200 hover:border-border-light cursor-pointer ${
                today ? 'border-gold/20 bg-gold/5' : 'border-border bg-bg-secondary/50'
              }`}
            >
              {/* Time column */}
              <div className="shrink-0 text-center min-w-[56px]">
                <p className={`font-mono text-lg font-semibold ${today ? 'text-gold' : 'text-cream'}`}>
                  {format(date, 'HH:mm')}
                </p>
                <p className={`text-2xs uppercase tracking-wider ${today ? 'text-gold/70' : 'text-cream-muted'}`}>
                  {today ? 'Auj.' : format(date, 'dd MMM', { locale: fr })}
                </p>
              </div>

              {/* Divider */}
              <div className={`w-px h-10 ${today ? 'bg-gold/30' : 'bg-border'}`} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <User size={13} className="text-cream-muted shrink-0" />
                  <p className="text-sm font-medium text-cream truncate">
                    {appt.client?.name || 'Client'}
                  </p>
                </div>
                <p className="text-xs text-cream-muted truncate">
                  {APPOINTMENT_TYPE_LABELS[appt.type]} · {appt.duration} min
                </p>
              </div>

              {today && (
                <div className="shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
