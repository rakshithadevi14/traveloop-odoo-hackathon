import { BarChart3, LayoutDashboard, PlusCircle, Shield, Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: BarChart3 },
  { to: '/trips/new', label: 'Create Trip', icon: PlusCircle },
  { to: '/budget', label: 'Budget', icon: Wallet }
];

export default function Sidebar({ isAdmin = false }) {
  return (
    <aside className='w-full border-r border-white/40 bg-white/70 p-4 md:min-h-[calc(100vh-64px)] md:w-64'>
      <nav className='space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
        {isAdmin && (
          <button className='flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100'>
            <Shield size={16} />
            Admin
          </button>
        )}
      </nav>
    </aside>
  );
}
