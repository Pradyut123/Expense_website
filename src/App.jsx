import React, { useState, useCallback, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import EditTransactionModal from './components/EditTransactionModal';
import { Menu, Loader2 } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import './App.css';

// Lazy load non-critical components
const MonthView = lazy(() => import('./components/MonthView'));
const UserProfile = lazy(() => import('./components/UserProfile'));

function App() {
  const { theme, setTheme, palette, setPalette } = useTheme();
  const { user, handleAuthSuccess, handleLogout } = useAuth();
  const { 
    transactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    totalIncome,
    totalExpense,
    balance
  } = useTransactions(user);

  const [activeTab, setActiveTab] = useState('home');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const closeEditModal = useCallback(() => setEditingTransaction(null), []);

  const handleUpdate = useCallback(async (data) => {
    await updateTransaction(data);
    closeEditModal();
  }, [updateTransaction, closeEditModal]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
        <p>Syncing Ledger...</p>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          closeSidebar();
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        theme={theme}
        setTheme={setTheme}
        palette={palette}
        setPalette={setPalette}
        transactions={transactions}
      />
      
      <main className="main-content-area">
        <header className="app-header glass-panel">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
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
        
        <Suspense fallback={<div className="loading-screen"><Loader2 className="animate-spin" /></div>}>
          {activeTab === 'home' && (
            <Dashboard 
              transactions={transactions}
              addTransaction={addTransaction}
              updateTransaction={handleUpdate}
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
        </Suspense>
      </main>

      <EditTransactionModal 
        editingTransaction={editingTransaction}
        setEditingTransaction={setEditingTransaction}
        addTransaction={addTransaction}
        updateTransaction={handleUpdate}
      />
    </div>
  );
}

export default App;
