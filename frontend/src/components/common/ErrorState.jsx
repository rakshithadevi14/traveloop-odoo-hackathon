import { CircleAlert } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className='glass-card rounded-2xl p-6 text-center shadow-lg'>
      <CircleAlert className='mx-auto mb-3 text-rose-500' size={22} />
      <p className='text-sm text-slate-600'>{message}</p>
      <button
        onClick={onRetry}
        className='mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700'
      >
        Retry
      </button>
    </div>
  );
}
