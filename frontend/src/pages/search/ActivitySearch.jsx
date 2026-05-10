import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const activityData = [
  {
    id: 'a1',
    name: 'Street Food Crawl',
    type: 'food',
    cost: 1800,
    city: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'
  },
  {
    id: 'a2',
    name: 'Museum Pass',
    type: 'culture',
    cost: 2500,
    city: 'Paris',
    image: 'https://images.unsplash.com/photo-1566127992631-137a642a90f4?w=600&q=80'
  },
  {
    id: 'a3',
    name: 'Scuba Session',
    type: 'adventure',
    cost: 4800,
    city: 'Maldives',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80'
  },
  {
    id: 'a4',
    name: 'City Walking Tour',
    type: 'sightseeing',
    cost: 900,
    city: 'Dubai',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80'
  }
];

const typeChips = ['all', 'food', 'culture', 'adventure', 'sightseeing'];

export default function ActivitySearch() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('all');
  const [maxCost, setMaxCost] = useState(5000);
  const [selectedTrip, setSelectedTrip] = useState('1');

  const filtered = useMemo(() => {
    return activityData.filter((activity) => {
      const typeOk = activeType === 'all' || activity.type === activeType;
      const costOk = activity.cost <= maxCost;
      return typeOk && costOk;
    });
  }, [activeType, maxCost]);

  const onAdd = (activity) => {
    navigate(`/trips/${selectedTrip}/itinerary`, { state: { activity } });
  };

  return (
    <section className='page-in space-y-4'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='mb-3 flex flex-wrap gap-2'>
          {typeChips.map((chip) => (
            <button
              key={chip}
              onClick={() => setActiveType(chip)}
              className={`rounded-full px-3 py-1 text-sm ${
                activeType === chip ? 'bg-[#0D9488] text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              {chip[0].toUpperCase() + chip.slice(1)}
            </button>
          ))}
        </div>

        <div className='grid gap-3 md:grid-cols-2'>
          <label className='text-sm text-slate-600'>
            Max cost: INR {maxCost.toLocaleString()}
            <input
              type='range'
              min='500'
              max='5000'
              step='100'
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className='mt-2 w-full'
            />
          </label>
          <label className='text-sm text-slate-600'>
            Add to trip
            <select className='input mt-2 !py-2' value={selectedTrip} onChange={(e) => setSelectedTrip(e.target.value)}>
              <option value='1'>Paris Escape</option>
              <option value='2'>Bali Retreat</option>
              <option value='3'>Japan Explorer</option>
            </select>
          </label>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((activity) => (
          <article key={activity.id} className='trip-card'>
            <div className='overflow-hidden rounded-t-xl'>
              <img src={activity.image} alt={activity.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
            </div>
            <div className='space-y-2 p-4'>
              <h3 className='font-sora text-base font-semibold text-slate-900'>{activity.name}</h3>
              <p className='text-sm text-slate-500'>{activity.city} • {activity.type}</p>
              <p className='text-sm font-medium text-slate-700'>INR {activity.cost.toLocaleString()}</p>
              <button className='btn-primary !px-3 !py-2 text-sm' onClick={() => onAdd(activity)}>
                Add to Itinerary
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
