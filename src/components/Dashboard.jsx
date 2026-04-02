import React from 'react';
import SummaryCards from './SummaryCards';
import ExpenseChart from './ExpenseChart';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

function Dashboard({ 
  transactions, 
  addTransaction, 
  updateTransaction,
  deleteTransaction, 
  totalIncome,
  totalExpense,
  balance,
  editingTransaction,
  setEditingTransaction
}) {
  return (
    <div className="dashboard-grid">
      <div className="main-column">
        <SummaryCards 
          balance={balance} 
          income={totalIncome} 
          expense={totalExpense} 
        />
        <ExpenseChart transactions={transactions} />
        <ExpenseList 
          transactions={transactions} 
          onDelete={deleteTransaction} 
          onEdit={setEditingTransaction}
        />
      </div>

      <div className="side-column">
        <ExpenseForm 
          onAdd={addTransaction} 
          onUpdate={updateTransaction}
          editingTransaction={editingTransaction}
          clearEdit={() => setEditingTransaction(null)}
        />
      </div>
    </div>
  );
}

export default Dashboard;
