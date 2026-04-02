import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MonthView from './components/MonthView';
import UserProfile from './components/UserProfile';
import Auth from './components/Auth';
import { Menu, X } from 'lucide-react';
import { client } from './sanityClient';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('expense-profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense-transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('home');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Specific states for the Monthly View tab
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  // Fetch Sanity Data on Load
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Query filters strictly for this user's records
      client.fetch(`*[_type == "expense" && author == "${user.username}"] | order(date desc)`)
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
        id: undefined, // Let sanity control _id natively
        author: user.username
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
      setEditingTransaction(null);
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

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('expense-profile');
  };

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Only useful for Home Dashboard summaries
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  if (loading) {
    return <div style={{ color: 'white', padding: '2rem' }}>Syncing with Sanity DB...</div>;
  }

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false); // Close on mobile after selection
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="main-content-area">
        <header className="app-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1>Finance Tracker</h1>
          </div>
          <div className="user-profile">
            <div className="profile-info" style={{ textAlign: 'right' }}>
              <strong>{user.name}</strong>
              <span>@{user.username}</span>
            </div>
            <div className="profile-icon" title="View Profile" onClick={() => setActiveTab('profile')}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        {activeTab === 'home' && (
          <Dashboard 
            transactions={transactions}
            addTransaction={addTransaction}
            updateTransaction={updateTransaction}
            deleteTransaction={deleteTransaction}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            balance={balance}
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
          />
        )}
        
        {activeTab === 'monthly' && (
          <MonthView 
            transactions={transactions}
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            filterYear={filterYear}
            setFilterYear={setFilterYear}
            deleteTransaction={deleteTransaction}
            setEditingTransaction={setEditingTransaction}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
