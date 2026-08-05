import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/appointments', icon: Calendar, label: 'Rendez-vous' },
  { to: '/payments', icon: CreditCard, label: 'Paiements' },
];

const Sidebar = ({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`flex flex-col h-full ${mobile ? 'p-4' : 'p-6'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-gold-gradient flex items-center justify-center">
              <span className="text-bg-primary font-mono font-bold text-sm">M</span>
            </div>
            <span className="font-serif text-lg font-semibold text-cream leading-tight">
              Master My<br />
              <span className="text-gold">Interview</span>
            </span>
          </div>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) => isActive ? 'nav-item-active flex items-center gap-3 px-3 py-2.5 rounded-lg text-gold border border-gold/20 bg-gold/10' : 'nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-cream-muted hover:bg-bg-secondary hover:text-cream transition-all duration-200'}
            onClick={mobile ? onClose : undefined}
          >
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
            <span className="text-bg-primary font-bold text-sm">
              {user?.name?.charAt(0) || 'Y'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-cream truncate">{user?.name}</p>
            <p className="text-xs text-cream-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-cream-muted hover:bg-error/10 hover:text-error transition-all duration-200 text-sm"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-surface border-r border-border shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-bg-surface border-r border-border z-10 animate-slide-in-right">
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-border">
          <button onClick={() => setMobileOpen(true)} className="btn-icon">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gold-gradient flex items-center justify-center">
              <span className="text-bg-primary font-mono font-bold text-xs">M</span>
            </div>
            <span className="font-serif text-base font-semibold text-cream">
              Master My <span className="text-gold">Interview</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-cream-muted">
            <ChevronRight size={12} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
