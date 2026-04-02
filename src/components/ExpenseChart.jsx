import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#818cf8', '#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function ExpenseChart({ transactions }) {
  const expenseData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // sort largest first
  }, [transactions]);

  if (expenseData.length === 0) {
    return (
      <div className="glass-panel chart-card">
        <h2>Expense Breakdown</h2>
        <div className="empty-state" style={{ padding: '5rem 1rem' }}>
          <PieChartIcon size={48} />
          <p>No expenses to visualize.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(25, 28, 41, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          color: '#fff'
        }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{payload[0].name}</p>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            ₹{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel chart-card">
      <h2>Expense Breakdown</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
