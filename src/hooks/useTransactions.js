import { useState, useEffect } from 'react';
import { client } from '../sanityClient';

export function useTransactions(user) {
  const [transactions, setTransactions] = useState(() => {
    const profile = localStorage.getItem('expense-profile');
    if (!profile) return [];
    
    const saved = localStorage.getItem('expense-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      client.fetch(`*[_type == "expense" && (userId == $userId || (author == $username && !defined(userId)))] | order(date desc)`, { 
        userId: user.id,
        username: user.username 
      })
        .then((data) => {
          setTransactions(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Sanity fetch error:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const addTransaction = async (transaction) => {
    try {
      const doc = {
        _type: 'expense',
        ...transaction,
        id: undefined,
        author: user.username,
        userId: user.id
      };
      const res = await client.create(doc);
      setTransactions([res, ...transactions]);
    } catch (e) {
      console.error(e);
      alert('Error creating document! Make sure your VITE_SANITY_TOKEN is set.');
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    try {
      const targetId = updatedTransaction._id || updatedTransaction.id;
      const res = await client.patch(targetId).set({
        title: updatedTransaction.title,
        amount: updatedTransaction.amount,
        date: updatedTransaction.date,
        type: updatedTransaction.type,
        category: updatedTransaction.category,
        notes: updatedTransaction.notes
      }).commit();
      
      setTransactions(transactions.map(t => 
        (t._id === res._id || t.id === res._id) ? res : t
      ));
    } catch (e) {
      console.error(e);
      alert('Error updating. Token missing?');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await client.delete(id);
      setTransactions(transactions.filter(t => (t._id !== id && t.id !== id)));
    } catch (e) {
      console.error(e);
      alert('Error deleting. Token missing?');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  return { 
    transactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance
  };
}
