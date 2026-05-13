import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function MonthYearFilter({ month, setMonth, year, setYear }) {
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  const goToPrev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goToNext = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <div className="glass-panel filter-bar">
      <div className="filter-bar-left">
        <Calendar size={18} color="var(--accent-primary)" />
        <span className="filter-label">Monthly View</span>
      </div>
      <div className="filter-bar-controls">
        <button className="filter-nav-btn" onClick={goToPrev} title="Previous month">
          <ChevronLeft size={18} />
        </button>
        <div className="filter-selects">
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, index) => (
              <option key={index} value={index}>{m}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <button className="filter-nav-btn" onClick={goToNext} title="Next month">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default MonthYearFilter;
