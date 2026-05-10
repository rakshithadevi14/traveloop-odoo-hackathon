import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const hasShownLoginToast = useRef(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!hasShownLoginToast.current) {
      toast.success('Login success. Welcome back!');
      hasShownLoginToast.current = true;
    }
  }, []);

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='mx-auto flex max-w-7xl flex-col md:flex-row'>
        <button
          className='m-4 inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm font-medium shadow-sm transition hover:scale-[1.02] hover:shadow md:hidden'
          onClick={() => setShowSidebar((v) => !v)}
        >
          <Menu size={16} />
          Menu
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 md:block ${
            showSidebar ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
          }`}
        >
          <Sidebar isAdmin={user?.role === 'admin'} />
        </div>

        <main key={location.pathname} className='animate-fade-slide flex-1 p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
