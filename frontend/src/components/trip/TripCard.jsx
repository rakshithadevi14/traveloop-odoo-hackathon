import { CalendarDays, MapPin, Trash2 } from 'lucide-react';

export default function TripCard({ trip, onView, onDelete }) {
  return (
    <article className='glass-card rounded-2xl p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl'>
      <h3 className='text-lg font-semibold text-slate-900'>{trip.title}</h3>
      <p className='mt-2 flex items-center gap-2 text-sm text-slate-500'>
        <CalendarDays size={14} className='shrink-0' />
        {trip.dates}
      </p>
      <p className='mt-2 flex items-center gap-2 text-sm text-slate-600'>
        <MapPin size={14} className='shrink-0' />
        {trip.description}
      </p>
      <div className='mt-4 flex flex-wrap gap-2'>
        <button
          onClick={onView}
          className='rounded-xl bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg'
        >
          View
        </button>
        <button
          onClick={onDelete}
          className='rounded-xl bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-200'
        >
          <span className='inline-flex items-center gap-1'>
            <Trash2 size={14} className='shrink-0' /> Delete
          </span>
        </button>
      </div>
    </article>
  );
}
