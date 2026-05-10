import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const cities = [
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80', avgCost: 45000 },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', avgCost: 70000 },
  { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80', avgCost: 120000 },
  { name: 'Paris', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80', avgCost: 130000 },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80', avgCost: 150000 },
  { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80', avgCost: 140000 },
  { name: 'Santorini', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80', avgCost: 125000 },
  { name: 'Dubai', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80', avgCost: 110000 }
];

const tripOptions = [
  { value: 'new', label: 'New Trip' },
  { value: '1', label: 'Paris Escape' },
  { value: '2', label: 'Bali Retreat' }
];

export default function CitySearch() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [targetMap, setTargetMap] = useState({});
  const query = params.get('q') || '';

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return cities;
    return cities.filter((city) => city.name.toLowerCase().includes(q));
  }, [query]);

  const onSearchChange = (value) => {
    const next = new URLSearchParams(params);
    if (value.trim()) next.set('q', value);
    else next.delete('q');
    setParams(next);
  };

  const onAddToTrip = (cityName) => {
    const target = targetMap[cityName] || 'new';
    if (target === 'new') {
      navigate('/trips/create', { state: { destination: cityName } });
      return;
    }
    navigate(`/trips/${target}/itinerary`, { state: { destination: cityName } });
  };

  return (
    <section className='page-in space-y-4'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <input value={query} onChange={(e) => onSearchChange(e.target.value)} placeholder='Search cities...' className='input' />
      </div>

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {filtered.map((city) => (
          <article key={city.name} className='trip-card'>
            <div className='overflow-hidden rounded-t-xl'>
              <img src={city.image} alt={city.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px 12px 0 0' }} />
            </div>
            <div className='space-y-3 p-4'>
              <div>
                <h3 className='font-sora text-base font-semibold text-slate-900'>{city.name}</h3>
                <p className='text-sm text-slate-500'>Avg cost: INR {city.avgCost.toLocaleString()}</p>
              </div>

              <div className='flex gap-2'>
                <select
                  className='input !py-2'
                  value={targetMap[city.name] || 'new'}
                  onChange={(e) => setTargetMap((prev) => ({ ...prev, [city.name]: e.target.value }))}
                >
                  {tripOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <button className='btn-primary !px-3 !py-2 text-sm' onClick={() => onAddToTrip(city.name)}>
                  Add to Trip
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
