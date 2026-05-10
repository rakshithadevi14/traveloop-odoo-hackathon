import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronRight, Briefcase, Trash2 } from 'lucide-react';
import { createChecklistItem, deleteChecklistItem, getTripChecklist, getTrips, toggleChecklistItem } from '../trips/api.js';

const CATEGORIES = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Medications', 'Miscellaneous'];
const TEMPLATES = {
  Documents: ['Passport', 'Visa', 'Flight tickets', 'Hotel booking', 'Travel insurance', 'ID card'],
  Clothing: ['T-shirts', 'Pants', 'Underwear', 'Socks', 'Jacket', 'Comfortable shoes', 'Sleepwear'],
  Electronics: ['Phone charger', 'Power bank', 'Earphones', 'Universal adapter', 'Camera'],
  Toiletries: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen', 'Deodorant', 'Face wash'],
  Medications: ['Pain relief', 'Antacids', 'Band-aids', 'Prescription medicines', 'Hand sanitizer'],
  Miscellaneous: ['Umbrella', 'Snacks', 'Water bottle', 'Travel pillow', 'Luggage lock']
};

const normalize = (payload) => {
  const items = Array.isArray(payload) ? payload : payload?.checklist || payload?.items || payload?.data || [];
  return items.map((item) => ({
    id: item?._id || item?.id,
    name: item?.name || 'Untitled',
    category: CATEGORIES.includes(item?.category) ? item.category : 'Miscellaneous',
    packed: Boolean(item?.packed ?? item?.checked ?? false)
  }));
};

export default function GlobalPackingChecklist() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState(() => Object.fromEntries(CATEGORIES.map((c) => [c, ''])));
  const [collapsed, setCollapsed] = useState(() => Object.fromEntries(CATEGORIES.map((c) => [c, false])));

  const fetchChecklist = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const payload = await getTripChecklist(tripId);
      setItems(normalize(payload));
    } catch (error) {
      toast.error(error.message || 'Could not load checklist');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      try {
        const list = await getTrips();
        setTrips(list);
        if (list.length > 0) {
          const firstId = list[0]._id || list[0].id;
          setSelectedTripId(firstId);
        }
      } catch (error) {
        toast.error(error.message || 'Could not load trips');
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) fetchChecklist(selectedTripId);
  }, [selectedTripId]);

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const percentage = totalCount ? Math.round((packedCount / totalCount) * 100) : 0;

  const grouped = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c, []]));
    for (const item of items) map[item.category].push(item);
    return map;
  }, [items]);

  const handleToggle = async (item) => {
    const next = !item.packed;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, packed: next } : i)));
    try {
      await toggleChecklistItem(selectedTripId, item.id, next);
    } catch (error) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, packed: item.packed } : i)));
      toast.error(error.message || 'Failed to update item');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Remove this item?')) return;
    try {
      await deleteChecklistItem(selectedTripId, item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleAddItem = async (category) => {
    const name = String(newItemName[category] || '').trim();
    if (!name) return;
    try {
      const created = await createChecklistItem(selectedTripId, { name, category, packed: false });
      setItems((prev) => [...prev, normalize([created])[0]]);
      setNewItemName((prev) => ({ ...prev, [category]: '' }));
    } catch (error) {
      toast.error(error.message || 'Failed to add item');
    }
  };

  const useTemplate = async () => {
    try {
      for (const category of CATEGORIES) {
        for (const name of TEMPLATES[category]) {
          await createChecklistItem(selectedTripId, { name, category, packed: false });
        }
      }
      await fetchChecklist(selectedTripId);
      toast.success('Template added');
    } catch (error) {
      toast.error(error.message || 'Failed to apply template');
    }
  };

  const resetAll = async () => {
    if (!window.confirm('Reset all packed items?')) return;
    try {
      await Promise.all(items.filter((i) => i.packed).map((i) => toggleChecklistItem(selectedTripId, i.id, false)));
      await fetchChecklist(selectedTripId);
      toast.success('Checklist reset');
    } catch (error) {
      toast.error(error.message || 'Failed to reset checklist');
    }
  };

  if (loading && !selectedTripId) return <section className='page-in rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>Loading...</section>;

  return (
    <section className='page-in space-y-4'>
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='font-sora text-xl font-semibold text-[#0F172A]'>Packing Checklist</h2>
          {trips.length > 0 ? (
            <select className='input max-w-xs' value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
              {trips.map((trip) => (
                <option key={trip._id || trip.id} value={trip._id || trip.id}>{trip.title || trip.name}</option>
              ))}
            </select>
          ) : (
            <p className='text-sm text-slate-500'>Create a trip first. <Link className='text-[#0D9488]' to='/trips/create'>Create trip</Link></p>
          )}
        </div>
      </div>

      {!selectedTripId ? (
        <div className='grid min-h-[320px] place-items-center rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm'>
          <div>
            <Briefcase className='mx-auto mb-2 text-slate-400' size={28} />
            <p className='text-slate-600'>Select a trip to manage your packing list</p>
          </div>
        </div>
      ) : (
        <>
          <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
            <p className='text-sm text-slate-700'>{packedCount} of {totalCount} items packed ({percentage}%)</p>
            <div className='mt-2 h-3 rounded-full bg-slate-100'>
              <div className={`h-3 rounded-full ${percentage === 100 ? 'bg-emerald-500' : 'bg-[#0D9488]'}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className='flex gap-2'>
            <button className='btn-secondary' onClick={useTemplate}>Use Template</button>
            <button className='btn-secondary' onClick={resetAll}>Reset All</button>
          </div>

          <div className='space-y-3'>
            {CATEGORIES.map((category) => {
              const catItems = grouped[category] || [];
              const catPacked = catItems.filter((i) => i.packed).length;
              return (
                <div key={category} className='rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                  <button
                    className='flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-left'
                    onClick={() => setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }))}
                  >
                    <span className='font-medium text-slate-800'>{category}</span>
                    <span className='flex items-center gap-2 text-sm text-slate-500'>
                      {catPacked}/{catItems.length} packed
                      {collapsed[category] ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {!collapsed[category] ? (
                    <div className='mt-3 space-y-2'>
                      {catItems.map((item) => (
                        <div key={item.id} className='flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2'>
                          <label className='flex items-center gap-3'>
                            <input
                              type='checkbox'
                              checked={item.packed}
                              onChange={() => handleToggle(item)}
                              style={{ accentColor: '#0D9488' }}
                            />
                            <span className={`text-sm ${item.packed ? 'text-gray-400 line-through' : 'text-slate-700'}`}>{item.name}</span>
                          </label>
                          <button className='rounded-md p-2 text-rose-600 hover:bg-rose-50' onClick={() => handleDelete(item)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <div className='flex gap-2'>
                        <input
                          className='input'
                          placeholder='Add item...'
                          value={newItemName[category]}
                          onChange={(e) => setNewItemName((prev) => ({ ...prev, [category]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddItem(category);
                            }
                          }}
                        />
                        <button className='btn-primary !py-2' onClick={() => handleAddItem(category)}>Add</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
