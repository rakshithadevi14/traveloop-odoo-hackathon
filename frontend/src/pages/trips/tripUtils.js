const destinationImages = {
  goa: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=400&q=80',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
  paris: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80',
  maldives: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80',
  santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80'
};

export const statusStyles = {
  Ongoing: 'bg-emerald-500 text-white',
  Upcoming: 'bg-blue-500 text-white',
  Completed: 'bg-slate-400 text-white'
};

export function getStatusFromTrip(trip) {
  if (trip?.status && ['Ongoing', 'Upcoming', 'Completed'].includes(trip.status)) {
    return trip.status;
  }

  const today = new Date();
  const start = trip?.startDate ? new Date(trip.startDate) : null;
  const end = trip?.endDate ? new Date(trip.endDate) : null;

  if (!start || !end) return 'Upcoming';
  if (today < start) return 'Upcoming';
  if (today > end) return 'Completed';
  return 'Ongoing';
}

export function formatTripDates(startDate, endDate) {
  if (!startDate || !endDate) return 'Dates TBD';
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  })}`;
}

export function normalizeTrip(raw) {
  const destination = raw?.destination || 'Unknown';
  const destinationImage = destinationImages[String(destination).toLowerCase()] || destinationImages.paris;
  const inputCover = String(raw?.coverImage || raw?.coverPhotoUrl || '').trim();
  const coverImage = inputCover
    ? inputCover.startsWith('http://') || inputCover.startsWith('https://')
      ? inputCover
      : `https://${inputCover.replace(/^\/+/, '')}`
    : destinationImage;
  return {
    id: raw?._id || raw?.id,
    name: raw?.name || raw?.title || 'Untitled Trip',
    title: raw?.title || raw?.name || 'Untitled Trip',
    destination,
    startDate: raw?.startDate,
    endDate: raw?.endDate,
    description: raw?.description || '',
    estimatedBudget: raw?.estimatedBudget || raw?.budget || 0,
    isPublic: Boolean(raw?.isPublic ?? raw?.is_public),
    coverImage,
    status: getStatusFromTrip(raw),
    createdAt: raw?.createdAt || new Date().toISOString(),
    updatedAt: raw?.updatedAt || new Date().toISOString()
  };
}

export function toTripPayload(form) {
  return {
    title: form.title.trim(),
    destination: form.destination.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    description: form.description.trim(),
    coverImage: form.coverImage.trim(),
    isPublic: form.isPublic,
    estimatedBudget: Number(form.estimatedBudget)
  };
}

export const fallbackTrips = [
  normalizeTrip({
    _id: '1',
    title: 'Paris Escape',
    destination: 'Paris',
    startDate: '2026-06-12',
    endDate: '2026-06-18',
    status: 'Upcoming',
    coverImage: destinationImages.paris,
    estimatedBudget: 125000,
    createdAt: '2026-05-01T00:00:00.000Z'
  }),
  normalizeTrip({
    _id: '2',
    title: 'Bali Retreat',
    destination: 'Bali',
    startDate: '2026-05-01',
    endDate: '2026-05-08',
    status: 'Ongoing',
    coverImage: destinationImages.bali,
    estimatedBudget: 98000,
    createdAt: '2026-04-20T00:00:00.000Z'
  }),
  normalizeTrip({
    _id: '3',
    title: 'Japan Explorer',
    destination: 'Tokyo',
    startDate: '2026-03-10',
    endDate: '2026-03-22',
    status: 'Completed',
    coverImage: destinationImages.tokyo,
    estimatedBudget: 156000,
    createdAt: '2026-03-01T00:00:00.000Z'
  })
];
