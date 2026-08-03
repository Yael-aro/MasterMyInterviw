import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Calendar, Users, Clock } from 'lucide-react';
import { getDashboardStats, getRevenueChart } from '../api/dashboard';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { UpcomingAppointments } from '../components/dashboard/UpcomingAppointments';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DashboardPage = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    refetchInterval: 60000,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['revenue-chart'],
    queryFn: getRevenueChart,
  });

  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-cream-muted uppercase tracking-widest mb-1 font-mono">
          {today}
        </p>
        <h1 className="page-title">
          Tableau de bord
        </h1>
        <p className="text-cream-muted text-sm mt-1">Vue d'ensemble de votre activité coaching</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 h-36 skeleton" />
          ))
        ) : (
          <>
            <StatCard
              title="Revenu du mois"
              value={`${(stats?.monthRevenue || 0).toLocaleString('fr-MA')} MAD`}
              subtitle="Paiements encaissés"
              icon={TrendingUp}
              accent
            />
            <StatCard
              title="RDV cette semaine"
              value={stats?.upcomingCount || 0}
              subtitle="7 prochains jours"
              icon={Calendar}
            />
            <StatCard
              title="Clients actifs"
              value={stats?.activeClients || 0}
              subtitle="En cours de suivi"
              icon={Users}
            />
            <StatCard
              title="RDV aujourd'hui"
              value={stats?.todayCount || 0}
              subtitle="Séances du jour"
              icon={Clock}
            />
          </>
        )}
      </div>

      {/* Chart + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {chartLoading ? (
            <div className="card p-6 h-72 skeleton" />
          ) : (
            <RevenueChart data={chartData || []} />
          )}
        </div>
        <div>
          {statsLoading ? (
            <div className="card p-6 h-72 skeleton" />
          ) : (
            <UpcomingAppointments appointments={stats?.upcomingAppointments || []} />
          )}
        </div>
      </div>
    </div>
  );
};
