const requiredFields = ['title', 'destination', 'startDate', 'endDate', 'description', 'coverImage', 'estimatedBudget'];

export const defaultTripForm = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  description: '',
  coverImage: '',
  isPublic: false,
  estimatedBudget: ''
};

export function validateTripForm(form) {
  for (const field of requiredFields) {
    if (!String(form[field] ?? '').trim()) {
      return `${field} is required`;
    }
  }

  if (Number(form.estimatedBudget) <= 0) {
    return 'estimated budget must be greater than 0';
  }

  if (new Date(form.endDate) < new Date(form.startDate)) {
    return 'end date cannot be before start date';
  }

  return '';
}

export default function TripForm({ form, setForm, onSubmit, submitting, submitLabel }) {
  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <input name='title' value={form.title} onChange={onChange} className='input' placeholder='Trip Title' />
      <input name='destination' value={form.destination} onChange={onChange} className='input' placeholder='Destination' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <input type='date' name='startDate' value={form.startDate} onChange={onChange} className='input' />
        <input type='date' name='endDate' value={form.endDate} onChange={onChange} className='input' />
      </div>
      <textarea name='description' value={form.description} onChange={onChange} className='input min-h-28' placeholder='Trip Description' />
      <input name='coverImage' value={form.coverImage} onChange={onChange} className='input' placeholder='Cover Photo URL' />

      {form.coverImage ? (
        <div className='overflow-hidden rounded-xl border border-slate-200'>
          <img
            src={form.coverImage}
            alt='Cover preview'
            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80';
            }}
          />
        </div>
      ) : null}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <input
          type='number'
          min='0'
          name='estimatedBudget'
          value={form.estimatedBudget}
          onChange={onChange}
          className='input'
          placeholder='Estimated Budget'
        />
        <label className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700'>
          <input type='checkbox' name='isPublic' checked={form.isPublic} onChange={onChange} />
          Make this trip public
        </label>
      </div>

      <button disabled={submitting} className='btn-primary disabled:cursor-not-allowed disabled:opacity-70'>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
