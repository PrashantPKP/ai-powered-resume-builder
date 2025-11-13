import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DatePicker = ({ 
  label, 
  value = '', 
  onChange, 
  placeholder = 'Select date',
  showMonth = false,
  showYear = true,
  allowCurrent = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const parseValue = () => {
    if (!value) return { year: '', month: '' };
    
    if (value.toLowerCase() === 'current' || value.toLowerCase() === 'present') {
      return { year: 'Current', month: 'Current' };
    }
    
    const parts = value.split(' ');
    if (parts.length === 2) {
      return { month: parts[0], year: parts[1] };
    } else if (parts.length === 1 && !isNaN(parts[0])) {
      return { year: parts[0], month: '' };
    }
    
    return { year: '', month: '' };
  };

  const { year, month } = parseValue();

  const handleYearChange = (selectedYear) => {
    const newMonth = showMonth ? (month || months[currentMonth]) : '';
    const newValue = showMonth 
      ? `${newMonth} ${selectedYear}`.trim()
      : selectedYear;
    onChange(newValue);
    if (!showMonth) setIsOpen(false);
  };

  const handleMonthChange = (selectedMonth) => {
    const newYear = year || currentYear;
    const newValue = `${selectedMonth} ${newYear}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handleCurrentSelect = () => {
    onChange('Present');
    setIsOpen(false);
  };

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    if (value.toLowerCase() === 'current' || value.toLowerCase() === 'present') {
      return 'Present';
    }
    return value;
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-left bg-white dark:bg-gray-700 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
              {formatDisplayValue()}
            </span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {allowCurrent && (
              <button
                type="button"
                onClick={handleCurrentSelect}
                className="w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/50 border-b border-gray-200 dark:border-gray-700 text-green-600 dark:text-green-400 font-medium"
              >
                Present / Current
              </button>
            )}
            
            {showMonth && (
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Select Month
                </div>
                {months.map((monthName, index) => (
                  <button
                    key={monthName}
                    type="button"
                    onClick={() => handleMonthChange(monthName)}
                    className={`w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/50 ${
                      month === monthName ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {monthName}
                  </button>
                ))}
              </div>
            )}
            
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Select Year
              </div>
              {years.map((yearOption) => (
                <button
                  key={yearOption}
                  type="button"
                  onClick={() => handleYearChange(yearOption.toString())}
                  className={`w-full px-3 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/50 ${
                    year === yearOption.toString() ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {yearOption}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DatePicker;