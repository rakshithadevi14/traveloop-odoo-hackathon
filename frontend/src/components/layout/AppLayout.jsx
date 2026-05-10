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
    `flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
      isActive
        ? 'border-l-[3px] border-[#0D9488] bg-[#1E293B] text-white'
        : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
    }`;

  return (
    <div className='flex h-screen bg-[#F8FAFC] text-[#334155]'>
      <aside className='hidden h-screen w-60 shrink-0 flex-col bg-[#0F172A] p-4 md:flex'>
        <div className='flex items-center gap-3'>
          <div className='grid h-9 w-9 place-items-center rounded-xl bg-[#1E293B] text-white'>
            <Plane size={18} />
          </div>
          <h1 className='font-sora text-xl font-semibold text-white'>Traveloop</h1>
        </div>

        <nav className='mt-6 space-y-1'>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className='mt-auto rounded-xl bg-[#1E293B] p-3'>
          <div className='flex items-center gap-3'>
            <div className='grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-[#0F172A]'>
              {initials}
            </div>
            <div>
              <p className='text-sm font-medium text-white'>{displayName}</p>
              <button className='text-xs text-[#94A3B8]' onClick={logout}>logout</button>
            </div>
          </div>
        </div>
      </aside>

      <main className='flex-1 overflow-y-auto p-4 pb-24 md:p-5 md:pb-5'>
        <header className='mb-5 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-md'>
          <h2 className='font-sora text-xl font-semibold text-[#0F172A]'>{title}</h2>
          <div className='flex items-center gap-3'>
            <div className='grid h-10 w-10 place-items-center rounded-full bg-slate-100 font-semibold text-slate-700'>
              {initials}
            </div>
            <button className='btn-primary !px-4 !py-2 text-sm' onClick={logout}>Logout</button>
          </div>
        </header>

        <Outlet />
      </main>

      <nav className='fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-2 py-2 md:hidden'>
        <div className='flex items-center gap-1 overflow-x-auto'>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-w-[92px] flex-col items-center rounded-lg px-2 py-2 text-[11px] ${
                    isActive ? 'bg-[#1E293B] text-white' : 'text-[#64748B]'
                  }`
                }
              >
                <Icon size={16} />
                <span className='mt-1 whitespace-nowrap'>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
