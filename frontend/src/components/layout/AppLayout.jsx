import {
  Plane,
  LayoutDashboard,
  Map,
  PlusCircle,
  Wallet,
  Users,
  CheckSquare,
  BookOpen,
  User,
  BarChart2
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/trips', label: 'Trips', icon: Map },
  { to: '/trips/create', label: 'Create Trip', icon: PlusCircle },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/community', label: 'Community', icon: Users },
  { to: '/checklist', label: 'Checklist', icon: CheckSquare },
  { to: '/notes', label: 'Notes', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/admin', label: 'Admin', icon: BarChart2, adminOnly: true }
];

function resolveTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname === '/trips') return 'Trips';
  if (pathname === '/trips/create') return 'Create Trip';
  if (pathname === '/budget') return 'Budget';
  if (pathname === '/community') return 'Community';
  if (pathname.startsWith('/community/')) return 'Public Itinerary';
  if (pathname === '/search/cities') return 'City Search';
  if (pathname === '/search/activities') return 'Activity Search';
  if (pathname === '/checklist') return 'Checklist';
  if (pathname === '/notes') return 'Notes';
  if (pathname === '/profile') return 'Profile';
  if (pathname === '/admin') return 'Admin';
  if (pathname.startsWith('/trips/')) {
    if (pathname.endsWith('/edit')) return 'Edit Trip';
    if (pathname.endsWith('/itinerary/view')) return 'View Itinerary';
    if (pathname.endsWith('/itinerary')) return 'Itinerary Builder';
    if (pathname.endsWith('/budget')) return 'Trip Budget';
    if (pathname.endsWith('/checklist')) return 'Trip Checklist';
    if (pathname.endsWith('/notes')) return 'Trip Notes';
    if (pathname.endsWith('/share')) return 'Share Trip';
    return 'Trip Details';
  }
  return 'Dashboard';
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);
  const title = resolveTitle(location.pathname);
  const initials = (user?.firstName || user?.name || 'A').slice(0, 1).toUpperCase();
  const displayName = user?.name || `${user?.firstName || 'Alex'} ${user?.lastName || 'Carter'}`;

  const navClass = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
      ? 'side-item-active bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/20'
      : 'side-item-idle text-slate-400 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <div className='flex h-screen bg-slate-50 text-slate-900'>
      <aside className='hidden h-screen w-72 shrink-0 flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 md:flex border-r border-slate-700/50'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-2.5 text-white shadow-lg shadow-teal-500/20'>
            <Plane size={20} />
          </div>
          <div>
            <h1 className='font-sora text-xl font-bold text-white'>Traveloop</h1>
            <p className='text-xs text-slate-400'>Travel Companion</p>
          </div>
        </div>

        <nav className='mt-8 space-y-1'>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                <Icon size={18} className='flex-shrink-0' />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className='mt-auto rounded-xl bg-gradient-to-br from-teal-900/40 to-blue-900/40 border border-teal-800/30 p-4'>
          <div className='flex items-center gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-bold text-white shadow-lg'>
              {initials}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-semibold text-white truncate'>{displayName}</p>
              <button className='text-xs text-teal-300 hover:text-teal-200 transition' onClick={logout}>Sign out</button>
            </div>
          </div>
        </div>
      </aside>

      <main className='flex-1 overflow-y-auto pb-24 md:pb-8'>
        <div className='sticky top-0 z-10 bg-gradient-to-b from-slate-50 to-transparent backdrop-blur-sm p-6 border-b border-slate-200/50'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='font-sora text-3xl font-bold text-slate-900'>{title}</h2>
              <p className='text-sm text-slate-500 mt-1'>Welcome back, {user?.firstName || 'traveler'}! ✨</p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='hidden sm:grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-sm font-bold text-white shadow-lg'>
                {initials}
              </div>
              <button className='btn-primary text-sm' onClick={logout}>Logout</button>
            </div>
          </div>
        </div>

        <div className='px-6 py-8'>
          <Outlet />
        </div>
      </main>

      <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-3 md:hidden shadow-2xl'>
        <div className='flex items-center gap-1 overflow-x-auto'>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-w-[72px] flex-col items-center rounded-lg px-2 py-2.5 text-[10px] font-medium transition-all ${isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon size={18} className='mb-1' />
                <span className='whitespace-nowrap'>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
