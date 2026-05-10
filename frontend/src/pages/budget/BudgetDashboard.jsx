import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { createExpense, deleteExpense, getTripExpenses, getTrips, updateExpense, updateTrip } from '../trips/api.js';

const CATEGORIES = ['Transport', 'Hotel', 'Food', 'Activities', 'Shopping', 'Other'];
const CATEGORY_COLORS = {
  Transport: '#0D9488',
  Hotel: '#3B82F6',
  Food: '#F59E0B',
  Activities: '#8B5CF6',
  Shopping: '#EC4899',
  Other: '#94A3B8'
};

const normalizeExpense = (e) => ({
  id: e?._id || e?.id,
  category: e?.category || 'Other',
  description: e?.description || '',
  date: String(e?.date || '').slice(0, 10),
  unit_cost: Number(e?.unitCost ?? e?.unit_cost ?? 0),
  quantity: Number(e?.qty ?? e?.quantity ?? 1)
});

export default function BudgetDashboard() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
    unit_cost: '',
    quantity: 1
  });

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const res = await getTrips();
        setTrips(res);
        if (res.length > 0) {
          setSelectedTripId(res[0]._id || res[0].id);
        }
      } catch (error) {
        toast.error(error.message || 'Could not load trips');
      }
    };
    loadTrips();
  }, []);

  useEffect(() => {
    if (!selectedTripId) return;
    const trip = trips.find((t) => (t._id || t.id) === selectedTripId);
    setSelectedTrip(trip || null);
    setTotalBudget(Number(trip?.estimatedBudget ?? trip?.budget ?? 0));
    fetchExpenses(selectedTripId);
  }, [selectedTripId, trips]);

  const fetchExpenses = async (tripId) => {
    try {
      setLoading(true);
      const res = await getTripExpenses(tripId);
      setExpenses(Array.isArray(res) ? res.map(normalizeExpense) : []);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.unit_cost * e.quantity, 0), [expenses]);
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  const pieData = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        name: cat,
        value: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.unit_cost * e.quantity, 0)
      })).filter((d) => d.value > 0),
    [expenses]
  );

  const barData = useMemo(() => {
    const rows = expenses.reduce((acc, e) => {
      const date = e.date || '';
      const existing = acc.find((d) => d.date === date);
      const amount = e.unit_cost * e.quantity;
      if (existing) existing.amount += amount;
      else acc.push({ date, amount });
      return acc;
    }, []);

    return rows
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, date: d.date ? d.date.slice(5) : '' }));
  }, [expenses]);

  const formatINR = (n) =>
    Number(n).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const handleSubmit = async () => {
    if (!form.description || !form.unit_cost) {
      toast.error('Fill description and cost');
      return;
    }
    try {
      if (editingId) {
        const res = await updateExpense(selectedTripId, editingId, form);
        const next = normalizeExpense(res);
        setExpenses((prev) => prev.map((e) => (e.id === editingId ? next : e)));
        toast.success('Expense updated');
      } else {
        const res = await createExpense(selectedTripId, form);
        setExpenses((prev) => [...prev, normalizeExpense(res)]);
        toast.success('Expense added');
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ category: 'Food', description: '', date: new Date().toISOString().split('T')[0], unit_cost: '', quantity: 1 });
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(selectedTripId, id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (expense) => {
    setForm({
      category: expense.category,
      description: expense.description,
      date: expense.date,
      unit_cost: expense.unit_cost,
      quantity: expense.quantity
    });
    setEditingId(expense.id);
    setShowModal(true);
  };

  const handleBudgetSave = async () => {
    try {
      await updateTrip(selectedTripId, { estimatedBudget: totalBudget });
      setTrips((prev) => prev.map((t) => ((t._id || t.id) === selectedTripId ? { ...t, estimatedBudget: totalBudget } : t)));
      toast.success('Budget updated');
    } catch {
      toast.error('Could not update budget');
    }
  };

  return (
    <div className='page-in mx-auto max-w-[1100px] space-y-6 p-2'>
      <div className='flex items-center justify-between'>
        <h1 className='font-sora text-2xl font-bold text-[#0F172A]'>Budget Tracker</h1>
        <select
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(e.target.value)}
          className='rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm'
        >
          <option value=''>Select a trip</option>
          {trips.map((t) => (
            <option key={t._id || t.id} value={t._id || t.id}>{t.title || t.name}</option>
          ))}
        </select>
      </div>

      {!selectedTripId ? (
        <div className='rounded-xl border border-slate-200 bg-white p-16 text-center text-slate-400'>Select a trip to track budget</div>
      ) : (
        <>
          {isOverBudget ? (
            <div className='rounded-xl border border-red-200 bg-red-50 p-3 font-medium text-red-600'>
              Over budget by {formatINR(totalSpent - totalBudget)}
            </div>
          ) : null}

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs text-slate-500'>Total Budget</p>
              <div className='mt-1 flex items-center gap-1'>
                <span className='text-xs text-slate-500'>₹</span>
                <input
                  type='number'
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  onBlur={handleBudgetSave}
                  className='w-full border-0 bg-transparent text-2xl font-bold text-[#0D9488] outline-none'
                />
              </div>
              <p className='text-xs text-slate-400'>Set budget</p>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs text-slate-500'>Total Spent</p>
              <p className='mt-1 text-2xl font-bold text-[#3B82F6]'>{formatINR(totalSpent)}</p>
              <p className='text-xs text-slate-400'>{expenses.length} expenses</p>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs text-slate-500'>Remaining</p>
              <p className={`mt-1 text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatINR(Math.abs(remaining))}</p>
              <p className='text-xs text-slate-400'>{remaining < 0 ? 'Over budget' : 'Left to spend'}</p>
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <p className='text-xs text-slate-500'>Avg per Day</p>
              <p className='mt-1 text-2xl font-bold text-violet-500'>
                {formatINR(
                  selectedTrip
                    ? totalSpent /
                        Math.max(
                          1,
                          Math.ceil((new Date(selectedTrip.endDate || selectedTrip.end_date) - new Date(selectedTrip.startDate || selectedTrip.start_date)) / 86400000)
                        )
                    : 0
                )}
              </p>
              <p className='text-xs text-slate-400'>Daily average</p>
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='mb-2 flex items-center justify-between text-sm'>
              <span className='text-slate-500'>Budget used</span>
              <span className={`font-semibold ${isOverBudget ? 'text-red-500' : 'text-[#0D9488]'}`}>{percentage}%</span>
            </div>
            <div className='h-2.5 overflow-hidden rounded-full bg-slate-100'>
              <div className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-[#0D9488]'}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <h3 className='mb-4 font-sora text-sm font-semibold text-slate-900'>Spending by Category</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <PieChart>
                    <Pie data={pieData} innerRadius={55} outerRadius={90} paddingAngle={3} dataKey='value'>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[entry.name] || '#94A3B8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatINR(val)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='grid h-[220px] place-items-center text-slate-400'>Add expenses to see chart</div>
              )}
            </div>
            <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
              <h3 className='mb-4 font-sora text-sm font-semibold text-slate-900'>Daily Spending</h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey='date' tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} />
                    <Tooltip formatter={(val) => formatINR(val)} />
                    <Bar dataKey='amount' fill='#0D9488' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className='grid h-[220px] place-items-center text-slate-400'>Add expenses to see chart</div>
              )}
            </div>
          </div>

          <div className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='font-sora text-sm font-semibold text-slate-900'>All Expenses</h3>
              <button className='rounded-lg bg-[#0D9488] px-4 py-2 text-sm font-medium text-white' onClick={() => { setShowModal(true); setEditingId(null); }}>
                + Add Expense
              </button>
            </div>
            {loading ? (
              <div className='py-10 text-center text-slate-400'>Loading...</div>
            ) : expenses.length === 0 ? (
              <div className='py-10 text-center text-slate-400'>No expenses yet. Add your first expense above.</div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm'>
                  <thead>
                    <tr className='border-b border-slate-200 text-left text-xs font-medium text-slate-500'>
                      {['Category', 'Description', 'Date', 'Unit Cost', 'Qty', 'Amount', ''].map((h) => (
                        <th key={h} className='px-3 py-2'>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e, i) => (
                      <tr key={e.id || i} className='border-b border-slate-100'>
                        <td className='px-3 py-3'>
                          <span className='rounded-full px-2 py-1 text-xs font-medium' style={{ backgroundColor: `${CATEGORY_COLORS[e.category] || '#94A3B8'}22`, color: CATEGORY_COLORS[e.category] || '#64748B' }}>
                            {e.category}
                          </span>
                        </td>
                        <td className='px-3 py-3 text-slate-900'>{e.description}</td>
                        <td className='px-3 py-3 text-slate-500'>{e.date}</td>
                        <td className='px-3 py-3'>{formatINR(e.unit_cost)}</td>
                        <td className='px-3 py-3'>{e.quantity}</td>
                        <td className='px-3 py-3 font-semibold'>{formatINR(e.unit_cost * e.quantity)}</td>
                        <td className='px-3 py-3'>
                          <button onClick={() => handleEdit(e)} className='mr-2 text-blue-500'>Edit</button>
                          <button onClick={() => handleDelete(e.id)} className='text-red-500'>Delete</button>
                        </td>
                      </tr>
                    ))}
                    <tr className='bg-slate-50'>
                      <td colSpan={5} className='px-3 py-3 font-bold text-slate-900'>Total</td>
                      <td className='px-3 py-3 text-base font-bold text-[#0D9488]'>{formatINR(totalSpent)}</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {showModal ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-2xl'>
            <h3 className='mb-5 font-sora text-lg font-bold text-slate-900'>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>
            <div className='space-y-3'>
              <div>
                <label className='mb-1 block text-xs text-slate-500'>Category</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className='input'>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className='mb-1 block text-xs text-slate-500'>Description</label>
                <input className='input' value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className='mb-1 block text-xs text-slate-500'>Date</label>
                <input type='date' className='input' value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
              </div>
              <div>
                <label className='mb-1 block text-xs text-slate-500'>Unit Cost (₹)</label>
                <input type='number' className='input' value={form.unit_cost} onChange={(e) => setForm((p) => ({ ...p, unit_cost: e.target.value }))} />
              </div>
              <div>
                <label className='mb-1 block text-xs text-slate-500'>Quantity</label>
                <input type='number' className='input' value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
              </div>
            </div>
            <div className='mt-5 flex gap-3'>
              <button className='flex-1 rounded-lg border border-slate-200 py-2 font-medium' onClick={() => { setShowModal(false); setEditingId(null); }}>Cancel</button>
              <button className='flex-1 rounded-lg bg-[#0D9488] py-2 font-semibold text-white' onClick={handleSubmit}>
                {editingId ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
