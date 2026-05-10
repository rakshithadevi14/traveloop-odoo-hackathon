import { LogOut, Plane } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='sticky top-0 z-30 border-b border-white/40 bg-white/80 backdrop-blur'>
      <div className='flex items-center justify-between px-4 py-3 md:px-6'>
        <div className='flex items-center gap-2'>
          <div className='rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-2 text-white shadow-lg'>
            <Plane size={18} />
          </div>
          <h1 className='text-lg font-semibold tracking-tight text-slate-900'>Traveloop</h1>
        </div>
        <div className='flex items-center gap-3'>
          <div className='hidden rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 sm:block'>
            {user?.name ?? 'Traveler'}
          </div>
          <button
            onClick={logout}
            className='inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700'
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
