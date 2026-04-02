import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Save, X } from 'lucide-react';

const CATEGORIES = {
  expense: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other']
};

function ExpenseForm({ onAdd, onUpdate, editingTransaction, clearEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIES['expense'][0]);
  const [notes, setNotes] = useState('');

  // When editingTransaction changes, pre-fill form
  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setNotes(editingTransaction.notes || '');
    } else {
      // Reset
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('expense');
      setCategory(CATEGORIES['expense'][0]);
      setNotes('');
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    if (editingTransaction) {
      onUpdate({
        ...editingTransaction, // keep original id
        title,
        amount: parseFloat(amount),
        date,
        type,
        category,
        notes
      });
      clearEdit();
    } else {
      onAdd({
        id: uuidv4(),
        title,
        amount: parseFloat(amount),
        date,
        type,
        category,
        notes
      });
      setTitle('');
      setAmount('');
      setNotes('');
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  return (
    <div className="glass-panel form-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, border: 'none', padding: 0 }}>
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        
        {editingTransaction && (
          <button onClick={clearEdit} style={{ background: 'transparent', color: 'var(--text-muted)' }} title="Cancel Edit">
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <div className="type-toggle">
            <button 
              type="button" 
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              Expense
            </button>
            <button 
              type="button" 
              className={`type-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            placeholder="e.g., Grocery" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input 
            type="number" 
            placeholder="0.00" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES[type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea 
            placeholder="Add some details..." 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {editingTransaction ? <><Save size={20} /> Save Changes</> : <><PlusCircle size={20} /> Add Transaction</>}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
