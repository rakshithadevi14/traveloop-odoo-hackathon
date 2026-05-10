import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BedDouble, Landmark, MapPin, Plane, PlusCircle, Trash2, UtensilsCrossed } from 'lucide-react';
import { createActivity, createStop, deleteActivity, deleteStop, getTripItinerary } from './api.js';

const fallbackItinerary = [
  {
    id: 's1',
    city: 'Goa',
    startDate: '2026-06-12',
    endDate: '2026-06-13',
    activities: [
      { id: 'a1', name: 'Beach Brunch', type: 'food', time: '10:30', cost: 1200, notes: 'Sea view table' },
      { id: 'a2', name: 'Fort Aguada', type: 'sightseeing', time: '16:00', cost: 500, notes: 'Sunset point' }
    ]
  },
  {
    id: 's2',
    city: 'Mumbai',
    startDate: '2026-06-14',
    endDate: '2026-06-15',
    activities: [{ id: 'a3', name: 'Marine Drive Walk', type: 'sightseeing', time: '18:30', cost: 0, notes: '' }]
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
      cost: Number(activity?.cost || 0),
      notes: activity?.notes || ''
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

export default function ItineraryBuilder() {
  const { id: tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState([]);
  const [selectedStopId, setSelectedStopId] = useState('');
  const [addingStop, setAddingStop] = useState(false);
  const [addingActivity, setAddingActivity] = useState(false);
  const [stopForm, setStopForm] = useState({ city: '', startDate: '', endDate: '' });
  const [activityForm, setActivityForm] = useState({ name: '', type: 'sightseeing', time: '', cost: '', notes: '' });

  const loadItinerary = async () => {
    setLoading(true);
    try {
      const payload = await getTripItinerary(tripId);
      const normalized = normalizeItinerary(payload);
      setStops(normalized);
      setSelectedStopId((prev) => prev || normalized[0]?.id || '');
    } catch {
      setStops(fallbackItinerary);
      setSelectedStopId((prev) => prev || fallbackItinerary[0]?.id || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItinerary();
  }, [tripId]);

  const selectedStop = useMemo(() => stops.find((stop) => stop.id === selectedStopId) || null, [stops, selectedStopId]);

  const onCreateStop = async (event) => {
    event.preventDefault();
    if (!stopForm.city || !stopForm.startDate || !stopForm.endDate) {
      toast.error('City and date range are required');
      return;
    }

    try {
      await createStop(tripId, stopForm);
      toast.success('Stop added');
      setStopForm({ city: '', startDate: '', endDate: '' });
      setAddingStop(false);
      await loadItinerary();
    } catch (error) {
      toast.error(error.message || 'Failed to add stop');
    }
  };

  const onDeleteStop = async (stopId) => {
    try {
      await deleteStop(tripId, stopId);
      toast.success('Stop deleted');
      await loadItinerary();
    } catch (error) {
      toast.error(error.message || 'Failed to delete stop');
    }
  };

  const onCreateActivity = async (event) => {
    event.preventDefault();
    if (!selectedStopId) return;
    if (!activityForm.name || !activityForm.type || !activityForm.time || !activityForm.cost) {
      toast.error('Name, type, time and cost are required');
      return;
    }

    try {
      await createActivity(selectedStopId, { ...activityForm, cost: Number(activityForm.cost) });
      toast.success('Activity added');
      setActivityForm({ name: '', type: 'sightseeing', time: '', cost: '', notes: '' });
      setAddingActivity(false);
      await loadItinerary();
    } catch (error) {
      toast.error(error.message || 'Failed to add activity');
    }
  };

  const onDeleteActivity = async (activityId) => {
    if (!selectedStopId) return;
    try {
      await deleteActivity(selectedStopId, activityId);
      toast.success('Activity deleted');
      await loadItinerary();
    } catch (error) {
      toast.error(error.message || 'Failed to delete activity');
    }
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in grid gap-4 lg:grid-cols-2'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-md'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Stops</h3>
          <button className='btn-secondary inline-flex items-center gap-1' onClick={() => setAddingStop((prev) => !prev)}>
            <PlusCircle size={14} /> Add Stop
          </button>
        </div>

        {addingStop ? (
          <form onSubmit={onCreateStop} className='mb-4 space-y-2 rounded-xl border border-slate-200 p-3'>
            <input
              className='input'
              placeholder='City'
              value={stopForm.city}
              onChange={(e) => setStopForm((prev) => ({ ...prev, city: e.target.value }))}
            />
            <div className='grid grid-cols-2 gap-2'>
              <input
                type='date'
                className='input'
                value={stopForm.startDate}
                onChange={(e) => setStopForm((prev) => ({ ...prev, startDate: e.target.value }))}
              />
              <input
                type='date'
                className='input'
                value={stopForm.endDate}
                onChange={(e) => setStopForm((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <button className='btn-primary !py-2'>Save Stop</button>
          </form>
        ) : null}

        <div className='space-y-2'>
          {stops.length === 0 ? <div className='text-sm text-slate-500'>No stops yet.</div> : null}
          {stops.map((stop) => (
            <button
              key={stop.id}
              onClick={() => setSelectedStopId(stop.id)}
              className={`w-full rounded-xl border px-3 py-3 text-left ${
                selectedStopId === stop.id ? 'border-[#0D9488] bg-teal-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <p className='font-sora text-sm font-semibold text-slate-900'>{stop.city}</p>
                  <p className='text-xs text-slate-500'>{formatDateRange(stop.startDate, stop.endDate)}</p>
                </div>
                <button
                  type='button'
                  className='rounded-lg bg-rose-100 p-2 text-rose-700 hover:bg-rose-200'
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteStop(stop.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-md'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Activities</h3>
          <button
            className='btn-secondary inline-flex items-center gap-1'
            disabled={!selectedStop}
            onClick={() => setAddingActivity((prev) => !prev)}
          >
            <PlusCircle size={14} /> Add Activity
          </button>
        </div>

        {!selectedStop ? <div className='text-sm text-slate-500'>Select a stop to manage activities.</div> : null}

        {addingActivity && selectedStop ? (
          <form onSubmit={onCreateActivity} className='mb-4 space-y-2 rounded-xl border border-slate-200 p-3'>
            <input
              className='input'
              placeholder='Activity name'
              value={activityForm.name}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <div className='grid grid-cols-2 gap-2'>
              <select
                className='input'
                value={activityForm.type}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value='sightseeing'>Sightseeing</option>
                <option value='food'>Food</option>
                <option value='hotel'>Hotel</option>
                <option value='transport'>Transport</option>
              </select>
              <input
                className='input'
                placeholder='Time'
                value={activityForm.time}
                onChange={(e) => setActivityForm((prev) => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <input
              type='number'
              min='0'
              className='input'
              placeholder='Cost'
              value={activityForm.cost}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, cost: e.target.value }))}
            />
            <textarea
              className='input min-h-20'
              placeholder='Notes'
              value={activityForm.notes}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
            <button className='btn-primary !py-2'>Save Activity</button>
          </form>
        ) : null}

        {selectedStop ? (
          <div className='space-y-2'>
            {selectedStop.activities.length === 0 ? <div className='text-sm text-slate-500'>No activities yet.</div> : null}
            {selectedStop.activities.map((activity) => {
              const Icon = activityIcons[activity.type] || MapPin;
              return (
                <div key={activity.id} className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='flex items-center gap-2 font-medium text-slate-900'>
                        <Icon size={14} /> {activity.name}
                      </p>
                      <p className='text-xs text-slate-500'>
                        {activity.time || 'Time TBD'} | INR {Number(activity.cost || 0).toLocaleString()}
                      </p>
                      {activity.notes ? <p className='mt-1 text-xs text-slate-500'>{activity.notes}</p> : null}
                    </div>
                    <button
                      className='rounded-lg bg-rose-100 p-2 text-rose-700 hover:bg-rose-200'
                      onClick={() => onDeleteActivity(activity.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
