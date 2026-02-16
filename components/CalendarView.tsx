import React, { useState, useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';
import { IconLeft, IconRight, IconAlert } from './ui/Icons';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CalendarView: React.FC = () => {
  const { transactions, categories } = useBudget();
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'YEAR'>('MONTH');

  // Helper to generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Pad empty days
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Real days
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    
    return days;
  }, [currentDate]);

  // Calculations based on selection
  const stats = useMemo(() => {
    let start: Date, end: Date;
    const now = selectedDate || new Date();

    if (viewMode === 'WEEK') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        start = new Date(now.setDate(diff));
        end = new Date(now.setDate(start.getDate() + 6));
    } else if (viewMode === 'YEAR') {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
    } else {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    }

    let total = 0;
    let essential = 0;
    let nonEssential = 0;

    transactions.forEach(t => {
        if (t.type !== 'EXPENSE') return;
        const tDate = new Date(t.date);
        const tTime = tDate.getTime();
        const isSameDay = tDate.getDate() === now.getDate() && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        
        let match = false;
        if (viewMode === 'MONTH') {
            if (isSameDay) match = true;
        } else {
            if (tTime >= start.getTime() && tTime <= end.getTime()) match = true;
        }

        if (match) {
            total += t.amount;
            const cat = categories.find(c => c.id === t.categoryId);
            if (cat?.type === 'ESSENTIAL') essential += t.amount;
            else nonEssential += t.amount;
        }
    });

    return { total, essential, nonEssential };
  }, [selectedDate, viewMode, transactions, categories]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleDateClick = (date: Date | null) => {
    if (date) {
        setSelectedDate(date);
        setViewMode('MONTH'); 
    }
  };

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const hasTransactions = (date: Date | null) => {
      if (!date) return false;
      return transactions.some(t => {
          const tDate = new Date(t.date);
          return tDate.getDate() === date.getDate() && 
                 tDate.getMonth() === date.getMonth() &&
                 tDate.getFullYear() === date.getFullYear();
      });
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 h-full flex flex-col">
       {/* Mode Toggle */}
       <div className="flex bg-slate-200 dark:bg-zinc-800 p-1 rounded-lg transition-colors">
           {['MONTH', 'WEEK', 'YEAR'].map(m => (
               <button 
                 key={m} 
                 onClick={() => setViewMode(m as any)}
                 className={`flex-1 text-xs font-semibold py-2 rounded-md transition-all 
                    ${viewMode === m 
                        ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600 dark:text-yellow-400' 
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'}`}
               >
                   {m}
               </button>
           ))}
       </div>

       {/* Calendar Grid */}
       {viewMode === 'MONTH' && (
           <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 transition-colors">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full"><IconLeft className="w-5 h-5 text-slate-600 dark:text-zinc-400"/></button>
                    <h2 className="font-bold text-slate-800 dark:text-white">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full"><IconRight className="w-5 h-5 text-slate-600 dark:text-zinc-400"/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {DAYS.map(d => <span key={d} className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, idx) => (
                        <button 
                          key={idx} 
                          disabled={!date}
                          onClick={() => handleDateClick(date)}
                          className={`
                            h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm relative transition-all
                            ${!date ? 'invisible' : ''}
                            ${isSelected(date) 
                                ? 'bg-indigo-600 dark:bg-yellow-400 text-white dark:text-black shadow-md font-bold' 
                                : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'}
                          `}
                        >
                            {date?.getDate()}
                            {hasTransactions(date) && !isSelected(date) && (
                                <span className="absolute bottom-1 w-1 h-1 bg-rose-500 dark:bg-yellow-600 rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
           </div>
       )}

       {/* Selected Stats Card */}
       <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-indigo-50 dark:border-zinc-800 overflow-hidden transition-colors">
           <div className="bg-indigo-600 dark:bg-yellow-400 p-4 text-white dark:text-black transition-colors">
               <p className="text-indigo-200 dark:text-yellow-800/70 text-xs font-medium uppercase tracking-wider mb-1">
                   {viewMode === 'MONTH' ? `Daily Summary (${selectedDate?.toLocaleDateString()})` : `${viewMode}ly Summary`}
               </p>
               <h3 className="text-3xl font-bold">Rs. {stats.total.toLocaleString()}</h3>
           </div>
           <div className="p-4 grid grid-cols-2 gap-4 divide-x divide-slate-100 dark:divide-zinc-800">
               <div className="text-center">
                   <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">Essential</p>
                   <p className="text-lg font-bold text-emerald-600 dark:text-white/90">Rs. {stats.essential.toLocaleString()}</p>
               </div>
               <div className="text-center">
                   <p className="text-xs text-slate-500 dark:text-zinc-400 mb-1">Non-Essential</p>
                   <p className="text-lg font-bold text-rose-500 dark:text-zinc-400">Rs. {stats.nonEssential.toLocaleString()}</p>
               </div>
           </div>
           {stats.nonEssential > stats.essential && stats.total > 0 && (
               <div className="bg-rose-50 dark:bg-zinc-800 px-4 py-2 flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs">
                   <IconAlert className="w-4 h-4" />
                   High non-essential spending detected!
               </div>
           )}
       </div>
    </div>
  );
};

export default CalendarView;