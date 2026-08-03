import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: boolean;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, accent }: StatCardProps) => {
  return (
    <div className={`card p-6 relative overflow-hidden group hover:border-border-light transition-all duration-300 ${accent ? 'border-gold/30' : ''}`}>
      {/* Background glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${accent ? 'bg-gold/3' : 'bg-cream/2'}`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${accent ? 'bg-gold/15' : 'bg-bg-secondary'}`}>
          <Icon size={20} className={accent ? 'text-gold' : 'text-cream-muted'} />
        </div>
        {trend && (
          <span className={`text-xs font-mono px-2 py-1 rounded-full ${
            trend.value >= 0 
              ? 'bg-success/10 text-success' 
              : 'bg-error/10 text-error'
          }`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>

      <div>
        <p className="text-xs text-cream-muted uppercase tracking-wider mb-1">{title}</p>
        <p className={`font-mono text-3xl font-semibold ${accent ? 'text-gold' : 'text-cream'}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-cream-subtle mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
