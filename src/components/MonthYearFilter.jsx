import React from 'react';
import { Calendar } from 'lucide-react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function MonthYearFilter({ month, setMonth, year, setYear }) {
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <>
      <Calendar size={20} color="var(--accent-primary)" />
      <div className="filter-group">
        <label>Filter By:</label>
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
    </>
  );
}

export default MonthYearFilter;
