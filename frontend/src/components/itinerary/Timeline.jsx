import { Calendar, MapPinned, Sparkles } from 'lucide-react';

export default function Timeline({ itinerary = [], loading = false }) {
  if (loading) {
    return (
      <section className='glass-card rounded-3xl p-6 shadow-lg'>
        <div className='mb-4 h-6 w-56 animate-pulse rounded bg-slate-200' />
        <div className='space-y-4'>
          <div className='h-24 animate-pulse rounded-2xl bg-slate-100' />
          <div className='h-24 animate-pulse rounded-2xl bg-slate-100' />
        </div>
      </section>
    );
  }

  return (
    <section className='rounded-3xl bg-gradient-to-b from-indigo-50/90 to-white/80 p-6 shadow-lg'>
      <div className='mb-6 flex items-center gap-2'>
        <Sparkles className='text-indigo-600' size={18} />
        <h2 className='text-xl font-semibold text-slate-900'>Itinerary Timeline</h2>
      </div>

      <div className='relative pl-6'>
        <div className='absolute left-2 top-1 h-[calc(100%-12px)] w-0.5 bg-indigo-200' />
        {itinerary.map((day, index) => (
          <div key={day.day} className='relative mb-8 last:mb-0'>
            <div className='absolute -left-[22px] top-1 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-indigo-100' />
            <h3 className='mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900'>
              <Calendar size={16} className='text-indigo-600' />
              Day {index + 1}
            </h3>
            <div className='glass-card rounded-2xl p-4 shadow'>
              <p className='mb-2 flex items-center gap-2 text-base font-medium text-slate-800'>
                <MapPinned size={16} className='text-purple-600' />
                {day.city}
              </p>
              <ul className='space-y-2 text-sm text-slate-600'>
                {day.stops.map((stop) => (
                  <li key={stop} className='rounded-lg bg-slate-50/90 px-3 py-2'>
                    {stop}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
