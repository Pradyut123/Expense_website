import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';

function MonthOverviewChart({ transactions, monthString }) {
  const dailyData = useMemo(() => {
    // Generate an object mapping every day to an amount
    const daysMap = {};
    const expenses = transactions.filter(t => t.type === 'expense');

    expenses.forEach(t => {
      const dateKey = t.date; // "YYYY-MM-DD"
      if (!daysMap[dateKey]) daysMap[dateKey] = 0;
      daysMap[dateKey] += t.amount;
    });

    // Convert into sorted array for chart
    return Object.entries(daysMap)
      .map(([date, amount]) => ({
        date,
        formattedDate: format(parseISO(date), 'MMM dd'),
        amount
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  if (dailyData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(25, 28, 41, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          color: '#fff'
        }}>
          <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payload[0].payload.formattedDate}</p>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--danger)' }}>
            Spent: ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Daily Spend: {monthString}</h2>
      <div style={{ flex: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="var(--text-muted)" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
              dy={10} 
            />
            <YAxis 
              stroke="var(--text-muted)" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar 
              dataKey="amount" 
              fill="var(--accent-primary)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthOverviewChart;
