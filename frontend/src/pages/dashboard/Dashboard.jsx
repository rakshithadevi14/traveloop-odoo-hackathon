import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const heroImage = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80';

const regionalPicks = [
  { city: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80' },
  { city: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80' },
  { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80' },
  { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80' },
  { city: 'Maldives', country: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80' },
  { city: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80' },
  { city: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80' },
  { city: 'Dubai', country: 'UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80' }
];

const statusStyles = {
  Ongoing: 'bg-emerald-500 text-white',
  Upcoming: 'bg-blue-500 text-white',
  Completed: 'bg-slate-400 text-white'
};

const fallbackTrips = [
  {
    _id: '1',
    name: 'Paris Escape',
    destination: 'Paris',
    startDate: '2026-06-12',
    endDate: '2026-06-18',
    status: 'Upcoming',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
    createdAt: '2026-05-01T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Bali Retreat',
    destination: 'Bali',
    startDate: '2026-05-01',
    endDate: '2026-05-08',
    status: 'Ongoing',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
    createdAt: '2026-04-20T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Japan Explorer',
    destination: 'Tokyo',
    startDate: '2026-03-10',
    endDate: '2026-03-22',
    status: 'Completed',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    createdAt: '2026-03-01T00:00:00.000Z'
  }
];

function formatDates(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates TBD';
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  })}`;
}

function normalizeTrips(payload) {
  const trips = Array.isArray(payload) ? payload : payload?.trips || payload?.data || [];
  return trips.map((trip) => ({
    id: trip._id || trip.id,
    name: trip.name || trip.title || 'Untitled Trip',
    destination: trip.destination || 'Unknown',
    startDate: trip.startDate,
    endDate: trip.endDate,
    status: trip.status || 'Upcoming',
    coverImage:
      trip.coverImage ||
      regionalPicks.find((pick) => pick.city.toLowerCase() === String(trip.destination || '').toLowerCase())?.image ||
      heroImage,
    createdAt: trip.createdAt || new Date().toISOString()
  }));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/trips');
        if (!response.ok) throw new Error('Trips request failed');
        const payload = await response.json();
        setTrips(normalizeTrips(payload));
      } catch {
        setTrips(fallbackTrips);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const recentTrips = useMemo(() => {
    return [...trips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [trips]);

  const filteredRecentTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recentTrips;
    return recentTrips.filter((trip) => {
      return (
        String(trip.name || '').toLowerCase().includes(q) ||
        String(trip.destination || '').toLowerCase().includes(q)
      );
    });
  }, [recentTrips, query]);

  return (
    <div className='page-in space-y-6'>
      <section className='relative h-[220px] overflow-hidden rounded-2xl'>
        <img src={heroImage} alt='Travel hero' className='h-full w-full object-cover' />
        <div className='absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.85),rgba(13,148,136,0.7))]' />
        <div className='relative z-10 flex h-full flex-col justify-center p-6 md:p-8'>
          <h2 className='font-sora text-3xl font-bold text-white'>Plan your next adventure</h2>
          <p className='mt-2 max-w-xl text-sm text-slate-200'>Build smarter trips with budget tracking, itineraries, and notes in one flow.</p>
          <button
            onClick={() => navigate('/trips/create')}
            className='mt-4 w-fit rounded-xl bg-[#0D9488] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#0F766E]'
          >
            Plan a New Trip
          </button>
        </div>
      </section>

      <section>
        <h3 className='mb-3 font-sora text-lg font-semibold text-[#0F172A]'>Top Regional Picks</h3>
        <div className='flex gap-4 overflow-x-auto pb-2'>
          {regionalPicks.map((pick) => (
            <button
              key={pick.city}
              onClick={() => navigate('/trips/create', { state: { destination: pick.city } })}
              className='min-w-[230px] rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg'
            >
              <div className='overflow-hidden rounded-xl'>
                <img src={pick.image} alt={pick.city} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
              </div>
              <p className='mt-2 font-sora text-[15px] font-semibold text-slate-900'>{pick.city}</p>
              <p className='text-xs text-slate-500'>{pick.country}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className='mb-3 flex flex-wrap items-center justify-between gap-3'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>My Recent Trips</h3>
          <div className='flex items-center gap-3'>
            <label className='flex min-w-[240px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'>
              <Search size={15} className='text-slate-500' />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search recent trips'
                className='w-full bg-transparent text-sm outline-none'
              />
            </label>
            <button onClick={() => navigate('/trips')} className='text-sm font-medium text-[#0D9488] hover:text-[#0F766E]'>View All</button>
          </div>
        </div>

        {loading ? (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {[1, 2, 3].map((key) => (
              <div key={key} className='h-[280px] animate-pulse rounded-2xl border border-slate-200 bg-white' />
            ))}
          </div>
        ) : filteredRecentTrips.length === 0 ? (
          <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>No trips match your search.</div>
        ) : recentTrips.length === 0 ? (
          <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>No trips yet.</div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {filteredRecentTrips.map((trip) => (
              <article key={trip.id} className='trip-card'>
                <div className='overflow-hidden rounded-t-xl'>
                  <img src={trip.coverImage} alt={trip.destination} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
                </div>
                <div className='p-4'>
                  <h4 className='font-sora text-[15px] font-semibold text-slate-900'>{trip.name}</h4>
                  <p className='text-[13px] text-slate-500'>{formatDates(trip.startDate, trip.endDate)}</p>
                  <span className={`mt-2 inline-block rounded-full px-[10px] py-[2px] text-[12px] ${statusStyles[trip.status] || statusStyles.Upcoming}`}>
                    {trip.status}
                  </span>
                  <button onClick={() => navigate(`/trips/${trip.id}`)} className='btn-secondary mt-3'>
                    View Trip
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
