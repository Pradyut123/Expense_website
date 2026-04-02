import { format } from 'date-fns';
import { Trash2, Edit2, Coffee, Car, Home, Zap, Film, Heart, DollarSign, Briefcase, Gift, HelpCircle, Activity } from 'lucide-react';

const categoryIcons = {
  Food: <Coffee size={20} />,
  Transport: <Car size={20} />,
  Rent: <Home size={20} />,
  Utilities: <Zap size={20} />,
  Entertainment: <Film size={20} />,
  Health: <Heart size={20} />,
  Salary: <Briefcase size={20} />,
  Freelance: <Activity size={20} />,
  Investments: <DollarSign size={20} />,
  Gift: <Gift size={20} />,
  Other: <HelpCircle size={20} />
};

function ExpenseList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="glass-panel list-card" style={{ marginTop: '2rem' }}>
        <h2 className="list-header" style={{ marginBottom: 0, border: 'none' }}>Recent Transactions</h2>
        <div className="empty-state">
          <Activity size={48} />
          <p>No transactions for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel list-card" style={{ marginTop: '2rem' }}>
      <h2 className="list-header">Recent Transactions</h2>
      <div className="transaction-list">
        {transactions.map(t => {
          const key = t._id || t.id;
          return (
            <div key={key} className="transaction-item">
              <div className="t-left">
              <div className={`icon-bg ${t.type}`}>
                {categoryIcons[t.category] || <DollarSign size={20} />}
              </div>
              <div className="t-info">
                <h4>{t.title}</h4>
                <p>
                  {format(new Date(t.date), 'MMM dd, yyyy')} • {t.category}
                </p>
                {t.notes && (
                  <div className="t-notes">
                    {t.notes}
                  </div>
                )}
              </div>
            </div>
            
            <div className="t-right">
              <div className={`t-amount ${t.type}`}>
                {t.type === 'expense' ? '-' : '+'}₹{t.amount.toFixed(2)}
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button className="delete-btn" title="Edit" onClick={() => onEdit(t)}>
                  <Edit2 size={16} />
                </button>
                <button className="delete-btn" title="Delete" onClick={() => onDelete(key)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

export default ExpenseList;
