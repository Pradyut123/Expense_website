import React, { useMemo } from 'react';
import MonthYearFilter from './MonthYearFilter';
import MonthOverviewChart from './MonthOverviewChart';
import ExpenseList from './ExpenseList';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

function MonthView({ 
  transactions, 
  filterMonth, 
  setFilterMonth, 
  filterYear, 
  setFilterYear,
  deleteTransaction,
  setEditingTransaction
}) {

  // Filter the transactions for this specific month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const dateObj = new Date(t.date);
      return dateObj.getMonth() === filterMonth && dateObj.getFullYear() === filterYear;
    });
  }, [transactions, filterMonth, filterYear]);

  const monthString = new Date(filterYear, filterMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Calculate Cumulative Balance (carrying over from previous months)
  const cumulativeBalance = useMemo(() => {
    const targetEndDate = new Date(filterYear, filterMonth + 1, 0); // Last day of selected month
    
    return transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      if (tDate <= targetEndDate) {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
      }
      return acc;
    }, 0);
  }, [transactions, filterMonth, filterYear]);

  // Monthly totals (for the other two cards)
  const monthIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const monthExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      {/* Month/Year Picker */}
      <MonthYearFilter 
        month={filterMonth} 
        setMonth={setFilterMonth} 
        year={filterYear} 
        setYear={setFilterYear} 
      />

      {/* Monthly Summary Cards */}
      <div className="summary-cards month-summary-cards">
        <div className="glass-panel summary-card" style={{ '--card-color': 'var(--accent-primary)' }}>
          <div className="icon-wrapper"><Wallet size={24} /></div>
          <h3>Month Balance</h3>
          <div style={{ color: cumulativeBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatCurrency(cumulativeBalance)}
          </div>
        </div>
        <div className="glass-panel summary-card" style={{ '--card-color': 'var(--success)' }}>
          <div className="icon-wrapper"><TrendingUp size={24} /></div>
          <h3>Month Income</h3>
          <div>{formatCurrency(monthIncome)}</div>
        </div>
        <div className="glass-panel summary-card" style={{ '--card-color': 'var(--danger)' }}>
          <div className="icon-wrapper"><TrendingDown size={24} /></div>
          <h3>Month Expenditure</h3>
          <div>{formatCurrency(monthExpense)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <MonthOverviewChart 
          transactions={filteredTransactions} 
          monthString={monthString} 
        />
        
        <ExpenseList 
          transactions={filteredTransactions} 
          onDelete={deleteTransaction} 
          onEdit={setEditingTransaction}
        />
      </div>
    </div>
  );
}

export default MonthView;
