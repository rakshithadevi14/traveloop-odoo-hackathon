import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Copy, Share2 } from 'lucide-react';
import { copyCommunityTrip, getCommunityTripById } from '../trips/api.js';

const fallbackTrip = {
  id: 'c1',
  title: 'Paris Long Weekend',
  destination: 'Paris',
  duration: '4 days',
  coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80',
  itinerary: [
    {
      day: 1,
      activities: [
        { id: 'a1', type: 'sightseeing', name: 'Louvre Museum', time: '10:00', cost: 1200 },
        { id: 'a2', type: 'food', name: 'Cafe Brunch', time: '13:00', cost: 1600 }
      ]
    },
    {
      day: 2,
      activities: [{ id: 'a3', type: 'transport', name: 'Seine River Cruise', time: '18:00', cost: 2200 }]
    }
  ]
};

function normalizePublicTrip(payload, fallbackId) {
  const trip = payload?.trip || payload?.data || payload || {};
  const itinerary = trip?.itinerary || trip?.days || trip?.stops || [];

  const normalizedItinerary = itinerary.map((day, index) => {
    const dayNumber = day?.day || day?.dayNumber || index + 1;
    const items = day?.activities || day?.items || [];
    return {
      day: dayNumber,
      activities: items.map((act) => ({
        id: act?._id || act?.id || `${dayNumber}-${Math.random()}`,
        type: String(act?.type || 'activity').toLowerCase(),
        name: act?.name || 'Untitled activity',
        time: act?.time || '',
        cost: Number(act?.cost || 0)
      }))
    };
  });

  return {
    id: trip?._id || trip?.id || fallbackId,
    title: trip?.title || trip?.name || 'Public Itinerary',
    destination: trip?.destination || 'Unknown',
    duration: trip?.duration || `${normalizedItinerary.length} days`,
    coverImage:
      trip?.coverImage ||
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80',
    itinerary: normalizedItinerary.length ? normalizedItinerary : fallbackTrip.itinerary
  };
}

export default function PublicItinerary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(fallbackTrip);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = await getCommunityTripById(id);
        setTrip(normalizePublicTrip(payload, id));
      } catch {
        setTrip({ ...fallbackTrip, id });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const totalCost = useMemo(
    () =>
      trip.itinerary.reduce(
        (sum, day) => sum + day.activities.reduce((daySum, activity) => daySum + Number(activity.cost || 0), 0),
        0
      ),
    [trip]
  );

  const onCopyToMyTrips = async () => {
    setCopying(true);
    try {
      const copied = await copyCommunityTrip(id);
      const newTripId = copied?._id || copied?.id || copied?.trip?._id || copied?.trip?.id;
      if (!newTripId) throw new Error('No trip id returned from copy endpoint');
      toast.success('Trip copied to your account');
      navigate(`/trips/${newTripId}`);
    } catch (error) {
      toast.error(error.message || 'Failed to copy itinerary');
    } finally {
      setCopying(false);
    }
  };

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Public URL copied');
    } catch {
      toast.error('Unable to copy URL');
    }
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in space-y-4'>
      <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md'>
        <img src={trip.coverImage} alt={trip.destination} className='h-56 w-full object-cover' />
        <div className='space-y-3 p-4'>
          <div>
            <h2 className='font-sora text-2xl font-semibold text-[#0F172A]'>{trip.title}</h2>
            <p className='text-sm text-slate-500'>{trip.destination} • {trip.duration}</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            <button className='btn-primary inline-flex items-center gap-1' onClick={onCopyToMyTrips} disabled={copying}>
              <Copy size={14} /> {copying ? 'Copying...' : 'Copy to My Trips'}
            </button>
            <button className='btn-secondary inline-flex items-center gap-1' onClick={onShare}>
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm'>
        Estimated total activity cost: INR {totalCost.toLocaleString()}
      </div>

      <div className='space-y-3'>
        {trip.itinerary.map((day) => (
          <div key={day.day} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
            <div className='mb-2 border-l-4 border-[#0D9488] pl-3'>
              <p className='font-sora text-base font-semibold text-[#0F172A]'>Day {day.day}</p>
            </div>
            <div className='space-y-2'>
              {day.activities.map((activity) => (
                <div key={activity.id} className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                  <p className='font-medium text-slate-800'>{activity.name}</p>
                  <p className='text-xs text-slate-500'>
                    {activity.time || 'Time TBD'} • INR {Number(activity.cost || 0).toLocaleString()} • {activity.type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
