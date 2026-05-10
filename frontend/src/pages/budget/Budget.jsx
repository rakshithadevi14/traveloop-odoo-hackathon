import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const budgetData = [
  { name: 'Transport', value: 32000 },
  { name: 'Hotels', value: 54000 },
  { name: 'Food', value: 24000 },
  { name: 'Activities', value: 15000 }
];

const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#0ea5e9'];

export default function Budget() {
  const total = budgetData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className='space-y-6'>
      <section className='rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg'>
        <p className='text-sm text-indigo-100'>Total Cost</p>
        <h2 className='text-4xl font-bold'>INR {total.toLocaleString()}</h2>
      </section>

      <section className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='glass-card rounded-3xl p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold text-slate-900'>Cost Breakdown</h3>
          <div className='h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie data={budgetData} dataKey='value' nameKey='name' innerRadius={55} outerRadius={90}>
                  {budgetData.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `INR ${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='glass-card rounded-3xl p-4 shadow-lg'>
          <h3 className='mb-4 text-lg font-semibold text-slate-900'>Activities and Cost</h3>
          <ul className='space-y-3'>
            {budgetData.map((item, index) => (
              <li key={item.name} className='flex items-center justify-between rounded-xl bg-slate-50/90 px-4 py-3'>
                <span className='flex items-center gap-2 text-slate-700'>
                  <span className='h-3 w-3 rounded-full' style={{ backgroundColor: colors[index % colors.length] }} />
                  {item.name}
                </span>
                <span className='font-semibold text-slate-900'>INR {item.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
