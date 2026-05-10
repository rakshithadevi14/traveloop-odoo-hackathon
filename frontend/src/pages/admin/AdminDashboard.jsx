import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { getAdminStats, getAdminTrips, getAdminUsers, updateUserStatus } from './api.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalTrips: 0, tripsThisMonth: 0, tripsPerDay: [], topDestinations: [] });
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [userQuery, setUserQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsData, usersData, tripsData] = await Promise.all([getAdminStats(), getAdminUsers(), getAdminTrips()]);
        setStats(statsData);
        setUsers(usersData);
        setTrips(tripsData.slice(0, 8));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (user?.role !== 'admin') {
    return <Navigate to='/' replace />;
  }

  const toggleStatus = async (userRow) => {
    const nextStatus = userRow.status === 'disabled' ? 'active' : 'disabled';
    try {
      const updated = await updateUserStatus(userRow._id || userRow.id, nextStatus);
      setUsers((prev) => prev.map((entry) => ((entry._id || entry.id) === (updated._id || updated.id) ? updated : entry)));
      toast.success(`User ${nextStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <section className='page-in rounded-2xl bg-white p-6 shadow-md'>Loading admin dashboard...</section>;
  }

  const filteredUsers = users.filter((entry) => {
    const query = userQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      String(entry.name || '').toLowerCase().includes(query) ||
      String(entry.email || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className='page-in space-y-5'>
      <section className='grid gap-4 md:grid-cols-3'>
        <article className='rounded-2xl bg-white p-5 shadow-md'><p className='text-sm text-slate-500'>Total Users</p><p className='mt-1 text-3xl font-semibold'>{stats.totalUsers}</p></article>
        <article className='rounded-2xl bg-white p-5 shadow-md'><p className='text-sm text-slate-500'>Total Trips</p><p className='mt-1 text-3xl font-semibold'>{stats.totalTrips}</p></article>
        <article className='rounded-2xl bg-white p-5 shadow-md'><p className='text-sm text-slate-500'>Trips This Month</p><p className='mt-1 text-3xl font-semibold'>{stats.tripsThisMonth}</p></article>
      </section>

      <section className='grid gap-4 lg:grid-cols-2'>
        <article className='rounded-2xl bg-white p-5 shadow-md'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Trips Per Day (30 days)</h3>
          <div className='mt-4 h-[260px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={stats.tripsPerDay || []}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type='monotone' dataKey='trips' stroke='#0D9488' strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className='rounded-2xl bg-white p-5 shadow-md'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Top Destinations</h3>
          <div className='mt-4 h-[260px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={stats.topDestinations || []}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='destination' tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey='trips' fill='#1E293B' radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className='grid gap-4 xl:grid-cols-2'>
        <article className='overflow-hidden rounded-2xl bg-white p-5 shadow-md'>
          <h3 className='mb-3 font-sora text-lg font-semibold text-[#0F172A]'>Recent Trips</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead><tr className='text-left text-slate-500'><th className='pb-2'>Title</th><th className='pb-2'>Destination</th><th className='pb-2'>User</th></tr></thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip._id || trip.id} className='border-t border-slate-100'>
                    <td className='py-2'>{trip.title || 'Untitled'}</td>
                    <td className='py-2'>{trip.destination || '-'}</td>
                    <td className='py-2'>{trip.user?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className='overflow-hidden rounded-2xl bg-white p-5 shadow-md'>
          <div className='mb-3 flex items-center justify-between gap-3'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Users</h3>
            <input
              className='input max-w-xs !py-2'
              placeholder='Search user by name/email'
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead><tr className='text-left text-slate-500'><th className='pb-2'>Name</th><th className='pb-2'>Email</th><th className='pb-2'>Status</th><th className='pb-2'>Action</th></tr></thead>
              <tbody>
                {filteredUsers.map((entry) => (
                  <tr key={entry._id || entry.id} className='border-t border-slate-100'>
                    <td className='py-2'>{entry.name}</td>
                    <td className='py-2'>{entry.email}</td>
                    <td className='py-2'>{entry.status || 'active'}</td>
                    <td className='py-2'>
                      <button className='rounded-lg border border-slate-300 px-2 py-1 text-xs' onClick={() => toggleStatus(entry)}>
                        {entry.status === 'disabled' ? 'Activate' : 'Disable'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td className='py-3 text-slate-500' colSpan={4}>No users match your search.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
