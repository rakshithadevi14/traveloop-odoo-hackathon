import { BarChart3, LayoutDashboard, PlusCircle, Shield, Wallet, Compass, Users, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: BarChart3 },
  { to: '/trips/create', label: 'Create Trip', icon: PlusCircle },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/community', label: 'Community', icon: Users },
];

export default function Sidebar({ isAdmin = false }) {
  return (
    <aside className='w-full border-r border-slate-200/30 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 md:min-h-[calc(100vh-64px)] md:w-72'>
      <nav className='space-y-2'>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'side-item-active bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/20'
                  : 'side-item-idle text-slate-400 hover:bg-slate-700 hover:text-white'
              }
            >
              <Icon size={18} className='flex-shrink-0' />
              <span className='font-medium'>{item.label}</span>
            </NavLink>
          );
        })}

        {isAdmin && (
          <>
            <div className='my-4 h-px bg-slate-700' />
            <button className='side-item side-item-idle text-slate-400 hover:bg-slate-700 hover:text-white w-full'>
              <Shield size={18} className='flex-shrink-0' />
              <span className='font-medium'>Admin Panel</span>
            </button>
          </>
        )}
      </nav>

      <div className='mt-8 rounded-xl bg-gradient-to-br from-teal-900/40 to-blue-900/40 border border-teal-800/30 p-4'>
        <Compass size={20} className='text-teal-400 mb-2' />
        <p className='text-sm font-medium text-slate-300'>Ready to explore?</p>
        <p className='text-xs text-slate-500 mt-1'>Create your first trip and start planning!</p>
      </div>
    </aside>
  );
}
