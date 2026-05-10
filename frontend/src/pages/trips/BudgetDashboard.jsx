import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { createExpense, deleteExpense, getTripBudget, updateExpense, updateTripBudget } from './api.js';

const CATEGORY_COLORS = {
  Transport: '#0D9488',
  Hotel: '#0F766E',
  Food: '#14B8A6',
  Activities: '#0EA5E9',
  Shopping: '#6366F1',
  Other: '#94A3B8'
};

const fallbackBudget = {
  totalBudget: 120000,
  startDate: '2026-06-12',
  endDate: '2026-06-18',
  expenses: [
    { id: 'e1', category: 'Transport', description: 'Flights', date: '2026-06-12', unitCost: 28000, qty: 1 },
    { id: 'e2', category: 'Hotel', description: 'Stay', date: '2026-06-13', unitCost: 5500, qty: 4 },
    { id: 'e3', category: 'Food', description: 'Meals', date: '2026-06-14', unitCost: 1500, qty: 3 },
    { id: 'e4', category: 'Activities', description: 'Tours', date: '2026-06-15', unitCost: 2500, qty: 2 }
  ]
};

function normalizeBudget(payload) {
  const expenses = payload?.expenses || payload?.items || payload?.data?.expenses || [];
  return {
    totalBudget: Number(payload?.totalBudget || payload?.budget || 0),
    startDate: payload?.startDate || payload?.tripStartDate || '',
    endDate: payload?.endDate || payload?.tripEndDate || '',
    expenses: expenses.map((e) => ({
      id: e?._id || e?.id,
      category: e?.category || 'Other',
      description: e?.description || '',
      date: e?.date ? String(e.date).slice(0, 10) : '',
      unitCost: Number(e?.unitCost || e?.unit_price || 0),
      qty: Number(e?.qty || e?.quantity || 1)
    }))
  };
}

function amount(expense) {
  return Number(expense.unitCost || 0) * Number(expense.qty || 0);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export default function BudgetDashboard() {
  const { id: tripId } = useParams();
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(fallbackBudget);
  const [budgetInput, setBudgetInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [newExpense, setNewExpense] = useState({ category: 'Transport', description: '', date: '', unitCost: '', qty: '1' });

  const loadBudget = async () => {
    setLoading(true);
    try {
      const payload = await getTripBudget(tripId);
      const normalized = normalizeBudget(payload);
      setBudget(normalized);
      setBudgetInput(String(normalized.totalBudget || ''));
    } catch {
      setBudget(fallbackBudget);
      setBudgetInput(String(fallbackBudget.totalBudget));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
  }, [tripId]);

  const totalSpent = useMemo(() => budget.expenses.reduce((sum, expense) => sum + amount(expense), 0), [budget.expenses]);
  const remaining = budget.totalBudget - totalSpent;
  const spentPercent = budget.totalBudget > 0 ? (totalSpent / budget.totalBudget) * 100 : 0;

  const totalDays = useMemo(() => {
    if (!budget.startDate || !budget.endDate) return 1;
    const start = new Date(budget.startDate);
    const end = new Date(budget.endDate);
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    return diff;
  }, [budget.startDate, budget.endDate]);

  const avgPerDay = totalSpent / totalDays;

  const donutData = useMemo(() => {
    const grouped = budget.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + amount(expense);
      return acc;
    }, {});

    return ['Transport', 'Hotel', 'Food', 'Activities', 'Shopping', 'Other'].map((category) => ({
      name: category,
      value: grouped[category] || 0
    }));
  }, [budget.expenses]);

  const barData = useMemo(() => {
    const grouped = budget.expenses.reduce((acc, expense) => {
      const date = expense.date || 'Unknown';
      acc[date] = (acc[date] || 0) + amount(expense);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((date) => ({ date, spend: grouped[date] }));
  }, [budget.expenses]);

  const onSaveTotalBudget = async () => {
    const nextValue = Number(budgetInput);
    if (!nextValue || nextValue <= 0) {
      toast.error('Enter a valid budget amount');
      return;
    }

    setBudget((prev) => ({ ...prev, totalBudget: nextValue }));
    try {
      await updateTripBudget(tripId, nextValue);
      toast.success('Budget updated');
    } catch (error) {
      toast.error(error.message || 'Failed to save budget');
    }
  };

  const onAddExpense = async (event) => {
    event.preventDefault();
    if (!newExpense.description || !newExpense.date || !newExpense.unitCost || !newExpense.qty) {
      toast.error('Please fill all expense fields');
      return;
    }

    const payload = {
      category: newExpense.category,
      description: newExpense.description,
      date: newExpense.date,
      unitCost: Number(newExpense.unitCost),
      qty: Number(newExpense.qty)
    };

    try {
      const created = await createExpense(tripId, payload);
      const normalized = {
        id: created?._id || created?.id || `tmp-${Date.now()}`,
        category: payload.category,
        description: payload.description,
        date: payload.date,
        unitCost: payload.unitCost,
        qty: payload.qty
      };
      setBudget((prev) => ({ ...prev, expenses: [normalized, ...prev.expenses] }));
      setShowAddModal(false);
      setNewExpense({ category: 'Transport', description: '', date: '', unitCost: '', qty: '1' });
      toast.success('Expense added');
    } catch (error) {
      toast.error(error.message || 'Failed to add expense');
    }
  };

  const onInlineChange = (id, field, value) => {
    setBudget((prev) => ({
      ...prev,
      expenses: prev.expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense))
    }));
  };

  const onSaveInline = async (expense) => {
    try {
      await updateExpense(tripId, expense.id, {
        category: expense.category,
        description: expense.description,
        date: expense.date,
        unitCost: Number(expense.unitCost),
        qty: Number(expense.qty)
      });
      setEditingId('');
      toast.success('Expense updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update expense');
    }
  };

  const onDeleteExpense = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(tripId, deleteTarget.id);
      setBudget((prev) => ({ ...prev, expenses: prev.expenses.filter((expense) => expense.id !== deleteTarget.id) }));
      setDeleteTarget(null);
      toast.success('Expense deleted');
    } catch (error) {
      toast.error(error.message || 'Failed to delete expense');
    }
  };

  const downloadCsv = () => {
    const header = ['Category', 'Description', 'Date', 'Unit Cost', 'Qty', 'Amount'];
    const rows = budget.expenses.map((expense) => [
      expense.category,
      expense.description,
      expense.date,
      expense.unitCost,
      expense.qty,
      amount(expense)
    ]);

    const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-${tripId}-budget.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className='h-64 animate-pulse rounded-2xl border border-slate-200 bg-white' />;
  }

  return (
    <section className='page-in space-y-5'>
      <div className='grid gap-3 md:grid-cols-2 xl:grid-cols-4'>
        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <p className='text-xs text-slate-500'>Total Budget</p>
          <div className='mt-2 flex items-center gap-2'>
            <input
              type='number'
              className='input !py-2'
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button className='btn-secondary !py-2' onClick={onSaveTotalBudget}>Save</button>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <p className='text-xs text-slate-500'>Total Spent</p>
          <p className='mt-2 font-sora text-xl font-semibold text-[#0F172A]'>INR {totalSpent.toLocaleString()}</p>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <p className='text-xs text-slate-500'>Remaining</p>
          <p className={`mt-2 font-sora text-xl font-semibold ${remaining < 0 ? 'text-rose-600' : 'text-[#0F172A]'}`}>
            INR {remaining.toLocaleString()}
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <p className='text-xs text-slate-500'>Avg per day</p>
          <p className='mt-2 font-sora text-xl font-semibold text-[#0F172A]'>INR {Math.round(avgPerDay).toLocaleString()}</p>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='mb-2 flex items-center justify-between text-xs text-slate-500'>
          <span>Spent vs Budget</span>
          <span>{spentPercent.toFixed(1)}%</span>
        </div>
        <div className='h-3 rounded-full bg-slate-100'>
          <div
            className={`h-3 rounded-full ${spentPercent > 100 ? 'bg-rose-500' : 'bg-[#0D9488]'}`}
            style={{ width: `${Math.min(100, spentPercent)}%` }}
          />
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Spend by Category</h3>
          <div className='mt-3 h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={donutData} dataKey='value' nameKey='name' innerRadius={58} outerRadius={92}>
                  {donutData.map((item) => (
                    <Cell key={item.name} fill={CATEGORY_COLORS[item.name] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `INR ${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Daily Spend</h3>
          <div className='mt-3 h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => `INR ${Number(value).toLocaleString()}`} />
                <Bar dataKey='spend' fill='#0D9488' radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Expenses</h3>
          <div className='flex gap-2'>
            <button className='btn-secondary' onClick={downloadCsv}>Download CSV</button>
            <button className='btn-primary' onClick={() => setShowAddModal(true)}>+ Add Expense</button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='border-b border-slate-200 text-left text-slate-500'>
                <th className='px-2 py-2'>Category</th>
                <th className='px-2 py-2'>Description</th>
                <th className='px-2 py-2'>Date</th>
                <th className='px-2 py-2'>Unit Cost</th>
                <th className='px-2 py-2'>Qty</th>
                <th className='px-2 py-2'>Amount</th>
                <th className='px-2 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budget.expenses.map((expense) => {
                const isEditing = editingId === expense.id;
                return (
                  <tr key={expense.id} className='border-b border-slate-100'>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <select className='input !py-2' value={expense.category} onChange={(e) => onInlineChange(expense.id, 'category', e.target.value)}>
                          <option>Transport</option>
                          <option>Hotel</option>
                          <option>Food</option>
                          <option>Activities</option>
                          <option>Shopping</option>
                          <option>Other</option>
                        </select>
                      ) : (
                        expense.category
                      )}
                    </td>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <input className='input !py-2' value={expense.description} onChange={(e) => onInlineChange(expense.id, 'description', e.target.value)} />
                      ) : (
                        expense.description
                      )}
                    </td>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <input type='date' className='input !py-2' value={expense.date} onChange={(e) => onInlineChange(expense.id, 'date', e.target.value)} />
                      ) : (
                        expense.date
                      )}
                    </td>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <input
                          type='number'
                          className='input !py-2'
                          value={expense.unitCost}
                          onChange={(e) => onInlineChange(expense.id, 'unitCost', Number(e.target.value))}
                        />
                      ) : (
                        `INR ${Number(expense.unitCost).toLocaleString()}`
                      )}
                    </td>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <input
                          type='number'
                          className='input !py-2'
                          value={expense.qty}
                          onChange={(e) => onInlineChange(expense.id, 'qty', Number(e.target.value))}
                        />
                      ) : (
                        expense.qty
                      )}
                    </td>
                    <td className='px-2 py-2 font-medium text-slate-800'>INR {amount(expense).toLocaleString()}</td>
                    <td className='px-2 py-2'>
                      {isEditing ? (
                        <div className='flex gap-1'>
                          <button className='btn-secondary !px-3 !py-1' onClick={() => onSaveInline(expense)}>Save</button>
                          <button className='btn-secondary !px-3 !py-1' onClick={() => setEditingId('')}>Cancel</button>
                        </div>
                      ) : (
                        <div className='flex gap-1'>
                          <button className='btn-secondary !px-3 !py-1' onClick={() => setEditingId(expense.id)}>Edit</button>
                          <button className='rounded-xl bg-rose-600 px-3 py-1 text-xs text-white hover:bg-rose-700' onClick={() => setDeleteTarget(expense)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className='bg-slate-50 font-semibold text-slate-800'>
                <td className='px-2 py-2' colSpan={5}>Grand Total</td>
                <td className='px-2 py-2'>INR {totalSpent.toLocaleString()}</td>
                <td className='px-2 py-2' />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Add Expense</h3>
            <form onSubmit={onAddExpense} className='mt-3 space-y-3'>
              <select className='input' value={newExpense.category} onChange={(e) => setNewExpense((prev) => ({ ...prev, category: e.target.value }))}>
                <option>Transport</option>
                <option>Hotel</option>
                <option>Food</option>
                <option>Activities</option>
                <option>Shopping</option>
                <option>Other</option>
              </select>
              <input
                className='input'
                placeholder='Description'
                value={newExpense.description}
                onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
              />
              <input type='date' className='input' value={newExpense.date} onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))} />
              <div className='grid grid-cols-2 gap-2'>
                <input
                  type='number'
                  className='input'
                  placeholder='Unit cost'
                  value={newExpense.unitCost}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, unitCost: e.target.value }))}
                />
                <input
                  type='number'
                  className='input'
                  placeholder='Qty'
                  value={newExpense.qty}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, qty: e.target.value }))}
                />
              </div>
              <div className='flex justify-end gap-2'>
                <button type='button' className='btn-secondary' onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className='btn-primary'>Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
            <h3 className='font-sora text-lg font-semibold text-[#0F172A]'>Delete this expense?</h3>
            <p className='mt-2 text-sm text-slate-500'>{deleteTarget.description}</p>
            <div className='mt-4 flex justify-end gap-2'>
              <button className='btn-secondary' onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className='rounded-xl bg-rose-600 px-4 py-2 text-sm text-white hover:bg-rose-700' onClick={onDeleteExpense}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
