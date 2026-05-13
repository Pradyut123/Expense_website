import React from 'react';
import { X } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

function EditTransactionModal({ 
  editingTransaction, 
  setEditingTransaction, 
  addTransaction, 
  updateTransaction 
}) {
  if (!editingTransaction) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ padding: '2rem', maxWidth: '450px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Edit Transaction</h2>
          <button 
            onClick={() => setEditingTransaction(null)}
            style={{ background: 'transparent', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>
        <ExpenseForm 
          addTransaction={addTransaction} 
          updateTransaction={updateTransaction} 
          editingTransaction={editingTransaction}
          setEditingTransaction={setEditingTransaction}
        />
      </div>
    </div>
  );
}

export default EditTransactionModal;
