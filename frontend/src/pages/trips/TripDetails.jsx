import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { CalendarDays, MapPin, Wallet, Globe2, Pencil, Trash2 } from 'lucide-react';
import { deleteTrip, getTripById } from './api.js';
import { formatTripDates, normalizeTrip, statusStyles } from './tripUtils.js';

const actionCards = [
  { key: 'builder', label: 'Build Itinerary', path: 'itinerary' },
  { key: 'view', label: 'View Itinerary', path: 'itinerary/view' },
  { key: 'budget', label: 'Budget Tracker', path: 'budget' },
  { key: 'checklist', label: 'Packing List', path: 'checklist' },
  { key: 'notes', label: 'Trip Notes', path: 'notes' }
];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await getTripById(id);
        setTrip(normalizeTrip(res));
      } catch (err) {
        console.error('Trip fetch error:', err);
        toast.error('Could not load trip');
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const stats = useMemo(() => {
    if (!trip) return [];

    const start = trip.startDate ? new Date(trip.startDate) : null;
    const end = trip.endDate ? new Date(trip.endDate) : null;
    const duration = start && end ? Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1) : 0;

    return [
      { label: 'Duration', value: duration ? `${duration} days` : 'Dates TBD', icon: CalendarDays },
      { label: 'Budget', value: `INR ${Number(trip.estimatedBudget || 0).toLocaleString()}`, icon: Wallet },
      { label: 'Status', value: trip.status, icon: Globe2 },
      { label: 'Destination', value: trip.destination, icon: MapPin }
    ];
  }, [trip]);

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteTrip(id);
      toast.success('Trip deleted');
      navigate('/trips');
    } catch (error) {
      toast.error(error.message || 'Failed to delete trip');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <section className='page-in space-y-5'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md'>
        <div className='relative'>
          <img
            src={trip.coverImage}
            alt={trip.destination}
            className='h-56 w-full object-cover'
            onError={(e) => {
              e.currentTarget.src = trip.fallbackCoverImage || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80';
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-[#0F172A]/85 to-transparent' />
          <div className='absolute bottom-4 left-4 right-4 flex items-end justify-between'>
            <div>
              <h2 className='font-sora text-2xl font-semibold text-white'>{trip.name}</h2>
              <p className='text-sm text-slate-200'>{trip.destination} - {formatTripDates(trip.startDate, trip.endDate)}</p>
              <span className={`mt-2 inline-block rounded-full px-[10px] py-[2px] text-[12px] ${statusStyles[trip.status] || statusStyles.Upcoming}`}>
                {trip.status}
              </span>
            </div>
            <div className='flex gap-2'>
              <button onClick={() => navigate(`/trips/${id}/edit`)} className='btn-secondary inline-flex items-center gap-1'>
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => setShowDeleteModal(true)} className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700'>
                <span className='inline-flex items-center gap-1'><Trash2 size={14} /> Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <p className='text-xs text-slate-500'>{stat.label}</p>
              <p className='mt-1 flex items-center gap-2 font-medium text-slate-800'><Icon size={14} /> {stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
        {actionCards.map((action) => (
          <button
            key={action.key}
            onClick={() => navigate(`/trips/${id}/${action.path}`)}
            className='rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md'
          >
            <p className='font-sora text-base font-semibold text-[#0F172A]'>{action.label}</p>
            <p className='mt-1 text-sm text-slate-500'>Open {action.label.toLowerCase()} for this trip</p>
          </button>
        ))}
      </div>

      {showDeleteModal ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Delete this trip?</h3>
            <p className='mt-2 text-sm text-slate-500'>This action cannot be undone.</p>
            <div className='mt-4 flex justify-end gap-2'>
              <button className='btn-secondary' onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button disabled={deleting} className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700' onClick={onDelete}>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
