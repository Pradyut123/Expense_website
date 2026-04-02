import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

function SummaryCards({ balance, income, expense }) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="summary-cards">
      <div className="glass-panel summary-card" style={{ '--card-color': 'var(--accent-primary)' }}>
        <div className="icon-wrapper">
          <Wallet size={24} />
        </div>
        <h3>Total Balance</h3>
        <div>{formatCurrency(balance)}</div>
      </div>

      <div className="glass-panel summary-card" style={{ '--card-color': 'var(--success)' }}>
        <div className="icon-wrapper">
          <TrendingUp size={24} />
        </div>
        <h3>Total Income</h3>
        <div>{formatCurrency(income)}</div>
      </div>

      <div className="glass-panel summary-card" style={{ '--card-color': 'var(--danger)' }}>
        <div className="icon-wrapper">
          <TrendingDown size={24} />
        </div>
        <h3>Total Expense</h3>
        <div>{formatCurrency(expense)}</div>
      </div>
    </div>
  );
}

export default SummaryCards;
