import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { RevenueChartData } from '../../types';

interface RevenueChartProps {
  data: RevenueChartData[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-elevated border border-border rounded-lg p-3 shadow-elevated">
        <p className="text-xs text-cream-muted mb-1">{label}</p>
        <p className="font-mono text-lg font-semibold text-gold">
          {payload[0].value.toLocaleString('fr-MA')} MAD
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Évolution du revenu</h3>
          <p className="text-xs text-cream-muted mt-0.5">6 derniers mois · paiements encaissés</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A227" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#8A8680', fontSize: 12, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8A8680', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#C9A227"
            strokeWidth={2}
            fill="url(#goldGradient)"
            dot={{ fill: '#C9A227', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: '#D4B445', stroke: '#C9A227', strokeWidth: 2, r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
