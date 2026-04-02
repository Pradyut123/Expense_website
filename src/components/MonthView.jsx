import React, { useMemo } from 'react';
import MonthYearFilter from './MonthYearFilter';
import MonthOverviewChart from './MonthOverviewChart';
import ExpenseList from './ExpenseList';

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

  return (
    <div>
      <div className="filter-container" style={{ marginBottom: '2rem' }}>
        <MonthYearFilter 
          month={filterMonth} 
          setMonth={setFilterMonth} 
          year={filterYear} 
          setYear={setFilterYear} 
        />
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
