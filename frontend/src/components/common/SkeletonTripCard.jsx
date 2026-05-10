export default function SkeletonTripCard() {
  return (
    <div className='glass-card rounded-2xl p-5 shadow-lg'>
      <div className='h-6 w-40 animate-pulse rounded bg-slate-200' />
      <div className='mt-3 h-4 w-32 animate-pulse rounded bg-slate-100' />
      <div className='mt-2 h-4 w-56 animate-pulse rounded bg-slate-100' />
      <div className='mt-5 flex gap-2'>
        <div className='h-9 w-16 animate-pulse rounded-xl bg-slate-200' />
        <div className='h-9 w-20 animate-pulse rounded-xl bg-slate-100' />
      </div>
    </div>
  );
}
