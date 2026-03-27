import React from 'react';
import { Receipt, RotateCcw, BarChart3, Building2, User, FileText } from 'lucide-react';

const navItems = [
  { id: 'expenses', label: 'Cheltuieli', icon: Receipt },
  { id: 'deconturi', label: 'Deconturi', icon: FileText },
  { id: 'recurring', label: 'Deconturi Recurente', icon: RotateCcw },
  { id: 'pl', label: 'P&L', icon: BarChart3 },
];

const bottomNavItems = [
  { id: 'companies', label: 'Companii', icon: Building2 },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function Sidebar({ currentView, onNavigate, selectedCompany, onCompanyChange }) {
  const renderNavItem = (item) => {
    const isActive = currentView === item.id;
    const Icon = item.icon;

    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors
          ${isActive
            ? 'bg-[#F1F5F9] text-[#0F172A] font-semibold'
            : 'text-[#64748B] hover:bg-[#F8FAFC] font-medium'
          }
        `}
      >
        <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
        <span className="text-sm">{item.label}</span>
      </button>
    );
  };

  return (
    <aside className="w-60 h-screen bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-6">
        <button
          onClick={() => onNavigate('expenses')}
          className="text-[#0F172A] text-2xl font-bold tracking-tight cursor-pointer"
        >
          bono
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(renderNavItem)}

        {/* Divider */}
        <div className="my-3 border-t border-[#E2E8F0]" />

        {bottomNavItems.map(renderNavItem)}
      </nav>

      {/* Company Selector */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <label className="block text-xs text-[#64748B] mb-1.5 px-1">Companie</label>
        <select
          value={selectedCompany}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full px-3 py-2 text-sm text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] transition-colors cursor-pointer"
        >
          <option value="bono">Bono</option>
        </select>
      </div>
    </aside>
  );
}
