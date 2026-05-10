import { LogOut, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='sticky top-0 z-40 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl shadow-sm'>
      <div className='flex items-center justify-between px-6 py-4 md:px-8'>
        <div className='flex items-center gap-3 group cursor-pointer'>
          <div className='rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-2.5 text-white shadow-md group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-all'>
            <Plane size={20} />
          </div>
          <div>
            <h1 className='text-xl font-bold tracking-tight text-slate-900'>Traveloop</h1>
            <p className='text-xs text-slate-500'>Plan. Explore. Remember.</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='hidden rounded-full bg-gradient-to-r from-teal-50 to-blue-50 px-4 py-1.5 text-sm font-semibold text-slate-700 sm:block border border-teal-200/50'>
            👤 {user?.name ?? 'Traveler'}
          </div>
          <button
            onClick={logout}
            className='inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:shadow-slate-500/30 active:scale-95 transition-all'
          >
            <LogOut size={16} />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
