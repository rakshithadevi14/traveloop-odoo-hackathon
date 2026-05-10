import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ChevronDown, ChevronRight, PlusCircle, RotateCcw, Trash2 } from 'lucide-react';
import { createChecklistItem, deleteChecklistItem, getTripChecklist, toggleChecklistItem } from './api.js';

const categories = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Medications', 'Miscellaneous'];

const templateItems = {
  Documents: ['Passport', 'Visa', 'Flight tickets', 'Hotel booking', 'Travel insurance'],
  Clothing: ['T-shirts', 'Pants', 'Underwear', 'Socks', 'Jacket', 'Comfortable shoes'],
  Electronics: ['Phone charger', 'Power bank', 'Earphones', 'Universal adapter'],
  Toiletries: ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen', 'Deodorant'],
  Medications: ['Pain relief', 'Antacids', 'Band-aids', 'Prescription medicines'],
  Miscellaneous: ['Water Bottle', 'Neck Pillow']
};

const fallbackItems = [
  { id: 'c1', name: 'Passport', category: 'Documents', checked: true },
  { id: 'c2', name: 'Power Bank', category: 'Electronics', checked: false },
  { id: 'c3', name: 'Jacket', category: 'Clothing', checked: false },
  { id: 'c4', name: 'Toothbrush', category: 'Toiletries', checked: true }
];

function normalizeChecklist(payload) {
  const items = Array.isArray(payload) ? payload : payload?.items || payload?.checklist || payload?.data || [];
  return items.map((item) => ({
    id: item?._id || item?.id,
    name: item?.name || item?.label || 'Untitled',
    category: categories.includes(item?.category) ? item.category : 'Miscellaneous',
    checked: Boolean(item?.packed ?? item?.checked ?? item?.isChecked)
  }));
}

export default function PackingChecklist() {
  const { id: tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [expanded, setExpanded] = useState(() => Object.fromEntries(categories.map((cat) => [cat, true])));
  const [showAdd, setShowAdd] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Documents' });

  const loadChecklist = async () => {
    setLoading(true);
    try {
      const payload = await getTripChecklist(tripId);
      setItems(normalizeChecklist(payload));
    } catch {
      setItems(fallbackItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChecklist();
  }, [tripId]);

  const totalItems = items.length;
  const packedCount = items.filter((item) => item.checked).length;
  const progress = totalItems ? (packedCount / totalItems) * 100 : 0;

  const grouped = useMemo(() => {
    const map = Object.fromEntries(categories.map((cat) => [cat, []]));
    items.forEach((item) => {
      map[item.category].push(item);
    });

    categories.forEach((cat) => {
      map[cat].sort((a, b) => Number(a.checked) - Number(b.checked));
    });

    return map;
  }, [items]);

  const onToggleChecked = async (item) => {
    const nextChecked = !item.checked;
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, checked: nextChecked } : it)));
    try {
      await toggleChecklistItem(tripId, item.id, nextChecked);
    } catch (error) {
      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, checked: item.checked } : it)));
      toast.error(error.message || 'Failed to update checklist item');
    }
  };

  const onDeleteItem = async (item) => {
    const previous = items;
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    try {
      await deleteChecklistItem(tripId, item.id);
      toast.success('Item deleted');
    } catch (error) {
      setItems(previous);
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const onAddItem = async (event) => {
    event.preventDefault();
    if (!newItem.name.trim()) {
      toast.error('Item name is required');
      return;
    }

    try {
      const created = await createChecklistItem(tripId, { name: newItem.name.trim(), category: newItem.category });
      setItems((prev) => [...prev, normalizeChecklist([created])[0]]);
      setNewItem({ name: '', category: 'Documents' });
      setShowAdd(false);
      toast.success('Item added');
    } catch (error) {
      toast.error(error.message || 'Failed to add item');
    }
  };

  const onResetAll = async () => {
    const toReset = items.filter((item) => item.checked);
    if (toReset.length === 0) {
      setShowResetConfirm(false);
      return;
    }

    const previous = items;
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));

    try {
      await Promise.all(toReset.map((item) => toggleChecklistItem(tripId, item.id, false)));
      toast.success('Checklist reset');
    } catch (error) {
      setItems(previous);
      toast.error(error.message || 'Failed to reset checklist');
    } finally {
      setShowResetConfirm(false);
    }
  };

  const onUseTemplate = async () => {
    const existingKeys = new Set(items.map((item) => `${item.category.toLowerCase()}::${item.name.toLowerCase()}`));
    const toCreate = [];

    categories.forEach((category) => {
      (templateItems[category] || []).forEach((name) => {
        const key = `${category.toLowerCase()}::${name.toLowerCase()}`;
        if (!existingKeys.has(key)) {
          toCreate.push({ name, category });
        }
      });
    });

    if (toCreate.length === 0) {
      toast('Template already applied');
      return;
    }

    try {
      const results = await Promise.all(toCreate.map((item) => createChecklistItem(tripId, item)));
      const normalized = normalizeChecklist(results);
      setItems((prev) => [...prev, ...normalized]);
      toast.success('Template items added');
    } catch (error) {
      toast.error(error.message || 'Failed to apply template');
    }
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in space-y-4'>
      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='mb-2 flex items-center justify-between'>
          <p className='text-sm font-medium text-slate-700'>{packedCount} of {totalItems} items packed</p>
          <div className='flex gap-2'>
            <button className='btn-secondary inline-flex items-center gap-1' onClick={onUseTemplate}>Use Template</button>
            <button className='btn-secondary inline-flex items-center gap-1' onClick={() => setShowResetConfirm(true)}>
              <RotateCcw size={14} /> Reset All
            </button>
            <button className='btn-primary inline-flex items-center gap-1' onClick={() => setShowAdd((prev) => !prev)}>
              <PlusCircle size={14} /> Add Item
            </button>
          </div>
        </div>
        <div className='h-3 rounded-full bg-slate-100'>
          <div className='h-3 rounded-full bg-[#0D9488]' style={{ width: `${progress}%` }} />
        </div>
      </div>

      {showAdd ? (
        <form onSubmit={onAddItem} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <div className='grid gap-3 md:grid-cols-3'>
            <input className='input md:col-span-2' placeholder='Item name' value={newItem.name} onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))} />
            <select className='input' value={newItem.category} onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value }))}>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className='mt-3 flex justify-end gap-2'>
            <button type='button' className='btn-secondary' onClick={() => setShowAdd(false)}>Cancel</button>
            <button className='btn-primary'>Save Item</button>
          </div>
        </form>
      ) : null}

      <div className='space-y-3'>
        {categories.map((category) => {
          const isOpen = expanded[category];
          const itemsInCategory = grouped[category] || [];
          return (
            <div key={category} className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
              <button
                className='flex w-full items-center justify-between px-4 py-3 text-left'
                onClick={() => setExpanded((prev) => ({ ...prev, [category]: !prev[category] }))}
              >
                <span className='font-sora text-base font-semibold text-[#0F172A]'>{category}</span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              {isOpen ? (
                <div className='space-y-2 px-4 pb-4'>
                  {itemsInCategory.length === 0 ? <div className='text-sm text-slate-500'>No items yet.</div> : null}
                  {itemsInCategory.map((item) => (
                    <div key={item.id} className='flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2'>
                      <label className='flex items-center gap-3'>
                        <input type='checkbox' checked={item.checked} onChange={() => onToggleChecked(item)} />
                        <span className={`text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.name}</span>
                      </label>
                      <button className='rounded-lg bg-rose-100 p-2 text-rose-700 hover:bg-rose-200' onClick={() => onDeleteItem(item)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {showResetConfirm ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Reset all checklist items?</h3>
            <p className='mt-2 text-sm text-slate-500'>This will mark every item as unpacked.</p>
            <div className='mt-4 flex justify-end gap-2'>
              <button className='btn-secondary' onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className='btn-primary' onClick={onResetAll}>Reset</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
