import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, Search } from 'lucide-react';
import { getCommunityTrips, likeCommunityTrip } from '../trips/api.js';

const fallbackTrips = [
  {
    id: 'c1',
    title: 'Paris Long Weekend',
    destination: 'Paris',
    duration: '4 days',
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    likes: 42,
    createdAt: '2026-05-09T11:00:00.000Z',
    user: { name: 'Maya Singh', avatar: '' }
  },
  {
    id: 'c2',
    title: 'Bali Remote Work Plan',
    destination: 'Bali',
    duration: '7 days',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    likes: 76,
    createdAt: '2026-05-08T09:20:00.000Z',
    user: { name: 'Arjun Patel', avatar: '' }
  },
  {
    id: 'c3',
    title: 'Tokyo Food and Transit Guide',
    destination: 'Tokyo',
    duration: '5 days',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    likes: 65,
    createdAt: '2026-05-07T14:10:00.000Z',
    user: { name: 'Nina Das', avatar: '' }
  }
];

function normalizeCommunityTrips(payload) {
  const trips = Array.isArray(payload) ? payload : payload?.trips || payload?.data || [];
  return trips.map((trip) => ({
    id: trip?._id || trip?.id,
    title: trip?.title || trip?.name || 'Untitled Public Trip',
    destination: trip?.destination || 'Unknown',
    duration: trip?.duration || `${trip?.days || 0} days`,
    coverImage: (() => {
      const rawCover = String(trip?.coverImage || '').trim();
      if (!rawCover) return 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
      if (rawCover.startsWith('http://') || rawCover.startsWith('https://')) return rawCover;
      return `https://${rawCover.replace(/^\/+/, '')}`;
    })(),
    likes: Number(trip?.likes || trip?.likeCount || 0),
    likes_count: Number(trip?.likesCount || trip?.likes_count || trip?.likes || trip?.likeCount || 0),
    createdAt: trip?.createdAt || new Date().toISOString(),
    user: {
      name: trip?.user?.name || trip?.author?.name || 'Traveler',
      avatar: trip?.user?.avatar || trip?.author?.avatar || ''
    }
  }));
}

export default function CommunityFeed() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = await getCommunityTrips();
        setTrips(normalizeCommunityTrips(payload));
      } catch {
        setTrips(fallbackTrips);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredTrips = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const base = trips.filter((trip) => {
      if (!lower) return true;
      return (
        trip.title.toLowerCase().includes(lower) ||
        trip.destination.toLowerCase().includes(lower) ||
        trip.user.name.toLowerCase().includes(lower)
      );
    });

    if (sortBy === 'mostLiked') {
      return [...base].sort((a, b) => b.likes - a.likes);
    }

    return [...base].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [trips, query, sortBy]);

  const onLike = async (tripId) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === tripId
          ? { ...trip, likes: trip.likes + 1, likes_count: (trip.likes_count || trip.likes || 0) + 1 }
          : trip
      )
    );
    try {
      await likeCommunityTrip(tripId);
    } catch (error) {
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === tripId
            ? {
                ...trip,
                likes: Math.max(0, trip.likes - 1),
                likes_count: Math.max(0, (trip.likes_count || trip.likes || 0) - 1),
              }
            : trip
        )
      );
      toast.error(error.message || 'Failed to like trip');
    }
  };

  return (
    <section className='page-in space-y-4'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='grid gap-3 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <label className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'>
              <Search size={16} className='text-slate-500' />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search public trips'
                className='w-full bg-transparent text-sm outline-none'
              />
            </label>
          </div>
          <select className='input' value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value='latest'>Latest</option>
            <option value='mostLiked'>Most Liked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {[1, 2, 3].map((k) => (
            <div key={k} className='h-[320px] animate-pulse rounded-2xl border border-slate-200 bg-white' />
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className='rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500'>No public trips found.</div>
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
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }}
                />
              </div>
              <div className='space-y-3 p-4'>
                <div className='flex items-center gap-2'>
                  <div className='grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700'>
                    {trip.user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <p className='text-sm text-slate-600'>{trip.user.name}</p>
                </div>

                <div>
                  <h3 className='font-sora text-base font-semibold text-slate-900'>{trip.title}</h3>
                  <p className='text-sm text-slate-500'>{trip.destination} - {trip.duration}</p>
                </div>

                <div className='flex items-center justify-between'>
                  <button className='btn-secondary inline-flex items-center gap-1 !px-3 !py-2' onClick={() => onLike(trip.id)}>
                    <Heart size={14} /> {trip.likes}
                  </button>
                  <button className='btn-primary !px-3 !py-2 text-sm' onClick={() => navigate(`/community/${trip.id}`)}>
                    View Itinerary
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
