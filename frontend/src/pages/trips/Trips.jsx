import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteTrip, getTrips } from './api.js';
import { fallbackTrips, formatTripDates, normalizeTrip, statusStyles } from './tripUtils.js';

const tabs = ['All', 'Ongoing', 'Upcoming', 'Completed'];

export default function Trips() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [tripToDelete, setTripToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const data = await getTrips();
        setTrips(data.map(normalizeTrip));
      } catch {
        setTrips(fallbackTrips);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    if (activeTab === 'All') return trips;
    return trips.filter((trip) => trip.status === activeTab);
  }, [trips, activeTab]);

  const onDeleteTrip = async () => {
    if (!tripToDelete) return;
    setDeleting(true);
    try {
      await deleteTrip(tripToDelete.id);
      setTrips((prev) => prev.filter((trip) => trip.id !== tripToDelete.id));
      toast.success('Trip deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete trip');
    } finally {
      setDeleting(false);
      setTripToDelete(null);
    }
  };

  return (
    <section className='page-in'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='font-sora text-xl font-semibold text-[#0F172A]'>Trip List</h2>
        <button onClick={() => navigate('/trips/create')} className='btn-primary !py-2'>+ Create Trip</button>
      </div>

      <div className='mb-4 flex flex-wrap gap-2'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              activeTab === tab ? 'bg-[#0D9488] text-white' : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {[1, 2, 3].map((key) => (
            <div key={key} className='h-[300px] animate-pulse rounded-2xl border border-slate-200 bg-white' />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>No trips in this filter.</div>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {filteredTrips.map((trip) => (
            <article key={trip.id} className='trip-card'>
              <div className='overflow-hidden rounded-t-xl'>
                <img
                  src={trip.coverImage}
                  alt={trip.destination}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
                  }}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                />
              </div>
              <div className='p-4'>
                <h3 className='font-sora text-[15px] font-semibold text-slate-900'>{trip.name}</h3>
                <p className='text-[13px] text-slate-500'>{trip.destination}</p>
                <p className='text-[13px] text-slate-500'>{formatTripDates(trip.startDate, trip.endDate)}</p>
                <span className={`mt-2 inline-block rounded-full px-[10px] py-[2px] text-[12px] ${statusStyles[trip.status] || statusStyles.Upcoming}`}>
                  {trip.status}
                </span>
                <div className='mt-4 flex flex-wrap gap-2'>
                  <button className='btn-secondary' onClick={() => navigate(`/trips/${trip.id}`)}>View</button>
                  <button className='btn-secondary inline-flex items-center gap-1' onClick={() => navigate(`/trips/${trip.id}/edit`)}>
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    className='inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700'
                    onClick={() => setTripToDelete(trip)}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tripToDelete ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Delete {tripToDelete.name}?</h3>
            <p className='mt-2 text-sm text-slate-500'>This action cannot be undone.</p>
            <div className='mt-4 flex justify-end gap-2'>
              <button className='btn-secondary' onClick={() => setTripToDelete(null)}>Cancel</button>
              <button
                disabled={deleting}
                className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-70'
                onClick={onDeleteTrip}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
