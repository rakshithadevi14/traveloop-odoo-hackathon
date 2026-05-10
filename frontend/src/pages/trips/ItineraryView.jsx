import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Plane, Printer, UtensilsCrossed, BedDouble, Landmark } from 'lucide-react';
import { getTripItinerary } from './api.js';

const fallbackItinerary = [
  {
    id: 's1',
    city: 'Goa',
    startDate: '2026-06-12',
    endDate: '2026-06-13',
    activities: [
      { id: 'a1', name: 'Beach Brunch', type: 'food', time: '10:30', cost: 1200 },
      { id: 'a2', name: 'Fort Aguada', type: 'sightseeing', time: '16:00', cost: 500 }
    ]
  },
  {
    id: 's2',
    city: 'Mumbai',
    startDate: '2026-06-14',
    endDate: '2026-06-15',
    activities: [{ id: 'a3', name: 'Marine Drive Walk', type: 'sightseeing', time: '18:30', cost: 0 }]
  }
];

const activityIcons = {
  food: UtensilsCrossed,
  sightseeing: Landmark,
  hotel: BedDouble,
  transport: Plane
};

function normalizeItinerary(payload) {
  const stops = Array.isArray(payload)
    ? payload
    : payload?.stops || payload?.itinerary || payload?.data?.stops || payload?.data || [];

  return stops.map((stop) => ({
    id: stop?._id || stop?.id,
    city: stop?.city || stop?.name || stop?.location || 'Unnamed Stop',
    startDate: stop?.startDate || stop?.fromDate || '',
    endDate: stop?.endDate || stop?.toDate || '',
    activities: (stop?.activities || stop?.items || []).map((activity) => ({
      id: activity?._id || activity?.id,
      name: activity?.name || 'Untitled Activity',
      type: String(activity?.type || 'sightseeing').toLowerCase(),
      time: activity?.time || '',
      cost: Number(activity?.cost || 0)
    }))
  }));
}

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates TBD';
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  })}`;
}

export default function ItineraryView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('timeline');
  const [stops, setStops] = useState([]);

  useEffect(() => {
    const loadItinerary = async () => {
      setLoading(true);
      try {
        const payload = await getTripItinerary(id);
        setStops(normalizeItinerary(payload));
      } catch {
        setStops(fallbackItinerary);
      } finally {
        setLoading(false);
      }
    };

    loadItinerary();
  }, [id]);

  const timelineDays = useMemo(() => {
    return stops.map((stop, index) => ({
      dayLabel: `Day ${index + 1}`,
      dateRange: formatDateRange(stop.startDate, stop.endDate),
      city: stop.city,
      activities: stop.activities
    }));
  }, [stops]);

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='inline-flex rounded-xl border border-slate-200 bg-white p-1'>
          <button
            onClick={() => setMode('timeline')}
            className={`rounded-lg px-3 py-2 text-sm ${mode === 'timeline' ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}
          >
            Timeline view
          </button>
          <button
            onClick={() => setMode('calendar')}
            className={`rounded-lg px-3 py-2 text-sm ${mode === 'calendar' ? 'bg-[#0D9488] text-white' : 'text-slate-600'}`}
          >
            Calendar view
          </button>
        </div>

        <button className='btn-secondary inline-flex items-center gap-1' onClick={() => window.print()}>
          <Printer size={14} /> Print
        </button>
      </div>

      {mode === 'timeline' ? (
        <div className='space-y-4'>
          {timelineDays.map((day) => (
            <div key={day.dayLabel} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <div className='mb-3 border-l-4 border-[#0D9488] pl-3'>
                <p className='font-sora text-base font-semibold text-[#0F172A]'>{day.dayLabel}</p>
                <p className='text-xs text-slate-500'>{day.city} • {day.dateRange}</p>
              </div>

              <div className='space-y-2'>
                {day.activities.length === 0 ? <div className='text-sm text-slate-500'>No activities for this day.</div> : null}
                {day.activities.map((activity) => {
                  const Icon = activityIcons[activity.type] || MapPin;
                  return (
                    <div key={activity.id} className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                      <p className='flex items-center gap-2 font-medium text-slate-900'>
                        <Icon size={14} /> {activity.name}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {activity.time || 'Time TBD'} • INR {Number(activity.cost || 0).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid gap-3 md:grid-cols-2'>
          {timelineDays.map((day) => (
            <div key={day.dayLabel} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
              <p className='font-sora text-base font-semibold text-[#0F172A]'>{day.dayLabel}</p>
              <p className='text-xs text-slate-500'>{day.city} • {day.dateRange}</p>
              <div className='mt-3 space-y-2'>
                {day.activities.map((activity) => (
                  <div key={activity.id} className='rounded-lg bg-slate-50 p-2 text-sm text-slate-700'>
                    <span className='font-medium'>{activity.time || '--:--'}</span> {activity.name} (INR {Number(activity.cost || 0).toLocaleString()})
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
