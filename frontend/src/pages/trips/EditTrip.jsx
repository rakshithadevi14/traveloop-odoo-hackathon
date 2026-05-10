import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TripForm, { defaultTripForm, validateTripForm } from './TripForm.jsx';
import { getTripById, updateTrip } from './api.js';
import { normalizeTrip, toTripPayload } from './tripUtils.js';

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultTripForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTrip = async () => {
      setLoading(true);
      try {
        const trip = normalizeTrip(await getTripById(id));
        setForm({
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate ? String(trip.startDate).slice(0, 10) : '',
          endDate: trip.endDate ? String(trip.endDate).slice(0, 10) : '',
          description: trip.description,
          coverImage: trip.coverImage,
          isPublic: trip.isPublic,
          estimatedBudget: String(trip.estimatedBudget || '')
        });
      } catch (error) {
        toast.error(error.message || 'Failed to load trip');
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateTripForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await updateTrip(id, toTripPayload(form));
      toast.success('Trip updated successfully');
      navigate(`/trips/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update trip');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md'>
      <h2 className='font-sora text-xl font-semibold text-[#0F172A]'>Edit Trip</h2>
      <p className='mt-1 text-sm text-[#64748B]'>Update your trip details and save changes.</p>
      <div className='mt-4'>
        <TripForm form={form} setForm={setForm} onSubmit={onSubmit} submitting={submitting} submitLabel='Update Trip' />
      </div>
    </section>
  );
}
