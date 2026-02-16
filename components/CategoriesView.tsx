import React, { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { IconFood, IconOther, IconTransport, IconSchool, IconHeart } from './ui/Icons';

const CategoriesView: React.FC = () => {
    const { transactions, categories } = useBudget();

    const spendingData = useMemo(() => {
        const data = {
            ESSENTIAL: { total: 0, items: [] as any[] },
            NON_ESSENTIAL: { total: 0, items: [] as any[] }
        };

        categories.forEach(cat => {
            const total = transactions
                .filter(t => t.categoryId === cat.id && t.type === 'EXPENSE')
                .reduce((sum, t) => sum + t.amount, 0);
            
            if (total > 0) {
                data[cat.type].total += total;
                data[cat.type].items.push({ ...cat, total });
            }
        });

        // Sort items by total desc
        data.ESSENTIAL.items.sort((a, b) => b.total - a.total);
        data.NON_ESSENTIAL.items.sort((a, b) => b.total - a.total);

        return data;
    }, [transactions, categories]);

    const totalSpent = spendingData.ESSENTIAL.total + spendingData.NON_ESSENTIAL.total;

    return (
        <div className="pb-24 pt-4 px-4 space-y-8 animate-fade-in">
             <div className="flex flex-col gap-1">
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expense Categories</h1>
                 <p className="text-sm text-slate-500 dark:text-zinc-400">Breakdown by necessity</p>
             </div>
             
             {/* Summary Bar */}
             {totalSpent > 0 && (
                <div className="flex h-4 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    <div 
                        style={{ width: `${(spendingData.ESSENTIAL.total / totalSpent) * 100}%` }}
                        className="bg-emerald-500 transition-all duration-500"
                    />
                    <div 
                        style={{ width: `${(spendingData.NON_ESSENTIAL.total / totalSpent) * 100}%` }}
                        className="bg-rose-500 transition-all duration-500"
                    />
                </div>
             )}

             {/* Essential Section */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Essential Expenses</h2>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Rs. {spendingData.ESSENTIAL.total.toLocaleString()}</span>
                </div>
                
                <div className="grid gap-3">
                    {spendingData.ESSENTIAL.items.length > 0 ? (
                        spendingData.ESSENTIAL.items.map(item => (
                            <CategoryRow key={item.id} item={item} totalSpent={totalSpent} color="bg-emerald-500" />
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 dark:bg-zinc-900 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">No essential expenses recorded yet.</p>
                    )}
                </div>
             </div>

             {/* Non-Essential Section */}
             <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
                        <h2 className="text-sm font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">Non-Essential / Extra</h2>
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Rs. {spendingData.NON_ESSENTIAL.total.toLocaleString()}</span>
                </div>

                 <div className="grid gap-3">
                     {spendingData.NON_ESSENTIAL.items.length > 0 ? (
                        spendingData.NON_ESSENTIAL.items.map(item => (
                            <CategoryRow key={item.id} item={item} totalSpent={totalSpent} color="bg-rose-500" />
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 dark:bg-zinc-900 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">No extra expenses recorded yet.</p>
                    )}
                 </div>
             </div>
        </div>
    );
}

interface CategoryRowProps {
  item: any;
  totalSpent: number;
  color: string;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ item, totalSpent, color }) => {
    // Basic icon mapping based on name keywords
    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('food')) return <IconFood className="w-4 h-4" />;
        if (n.includes('transport')) return <IconTransport className="w-4 h-4" />;
        if (n.includes('university')) return <IconSchool className="w-4 h-4" />;
        if (n.includes('passion')) return <IconHeart className="w-4 h-4" />;
        if (n.includes('other')) return <IconOther className="w-4 h-4" />;
        return <span className="text-xs font-bold">{name.charAt(0)}</span>;
    };

    const percentage = totalSpent > 0 ? Math.round((item.total / totalSpent) * 100) : 0;

    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 flex justify-between items-center transition-transform active:scale-[0.99]">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} bg-opacity-10 text-${color.split('-')[1]}-600 dark:text-${color.split('-')[1]}-400`}>
                    {getIcon(item.name)}
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-zinc-200 text-sm">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-16 h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                             <div style={{ width: `${percentage}%` }} className={`h-full ${color}`}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">{percentage}% of total</p>
                    </div>
                </div>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Rs. {item.total.toLocaleString()}</span>
        </div>
    );
}

export default CategoriesView;