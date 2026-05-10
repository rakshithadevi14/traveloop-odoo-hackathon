import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TripForm, { defaultTripForm, validateTripForm } from './TripForm.jsx';
import { createTrip } from './api.js';
import { normalizeTrip, toTripPayload } from './tripUtils.js';

export default function CreateTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultTripForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const incomingDestination = location.state?.destination;
    if (incomingDestination) {
      setForm((prev) => ({ ...prev, destination: incomingDestination }));
    }
  }, [location.state]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateTripForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = toTripPayload(form);
      const created = await createTrip(payload);
      const normalized = normalizeTrip(created);
      toast.success('Trip created successfully');
      navigate(`/trips/${normalized.id}`, { replace: true });
    } catch (error) {
      toast.error(error.message || 'Failed to create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className='page-in mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md'>
      <h2 className='font-sora text-xl font-semibold text-[#0F172A]'>Create Trip</h2>
      <p className='mt-1 text-sm text-[#64748B]'>Fill in all details to create your trip.</p>
      <div className='mt-4'>
        <TripForm form={form} setForm={setForm} onSubmit={onSubmit} submitting={submitting} submitLabel='Create Trip' />
      </div>
    </section>
  );
}
