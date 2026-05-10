import { Link } from 'react-router-dom';

export default function EmptyState({ message = 'No trips yet', ctaLabel = 'Create Trip' }) {
  return (
    <div className='glass-card rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600 shadow'>
      <p className='text-base font-medium'>{message}</p>
      <p className='mt-1 text-sm text-slate-500'>Start your first journey.</p>
      <Link
        to='/trips/new'
        className='mt-4 inline-flex rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90'
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
