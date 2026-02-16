import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { Account, Category, Transaction } from '../types';
import { IconCash, IconBank, IconCard } from './ui/Icons';

interface Props {
  onClose: () => void;
}

const AddTransaction: React.FC<Props> = ({ onClose }) => {
  const { accounts, categories, addTransaction } = useBudget();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedAccount || !selectedCategory) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      accountId: selectedAccount,
      categoryId: selectedCategory,
      date: new Date(date).toISOString(),
      type: 'EXPENSE', // Defaulting to expense for this MVP as requested
    };

    addTransaction(newTransaction);
    onClose();
  };

  const getAccountIcon = (type: Account['type']) => {
      switch(type) {
          case 'CASH': return <IconCash className="w-4 h-4"/>;
          case 'BANK_BOC': 
          case 'BANK_PEOPLES': return <IconBank className="w-4 h-4"/>;
          default: return <IconCard className="w-4 h-4"/>;
      }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 animate-slide-up transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">New Expense</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300">Close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Amount</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold">Rs</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-yellow-400 outline-none"
                        placeholder="0.00"
                        autoFocus
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                 <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Description</label>
                 <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-yellow-400 outline-none"
                    placeholder="What was this for?"
                />
            </div>

            {/* Account Selection */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">Account</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {accounts.map(acc => (
                        <button
                            key={acc.id}
                            type="button"
                            onClick={() => setSelectedAccount(acc.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all text-sm
                                ${selectedAccount === acc.id 
                                    ? 'bg-indigo-600 dark:bg-yellow-400 border-indigo-600 dark:border-yellow-400 text-white dark:text-black shadow-md' 
                                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'}
                            `}
                        >
                            {getAccountIcon(acc.type)}
                            {acc.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Selection */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                         <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`
                                text-left px-3 py-2 rounded-lg text-sm transition-all border
                                ${selectedCategory === cat.id
                                    ? 'bg-emerald-50 dark:bg-yellow-400/10 border-emerald-500 dark:border-yellow-400 text-emerald-700 dark:text-yellow-400 font-medium'
                                    : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800'}
                            `}
                        >
                            {cat.name}
                            <span className="block text-[10px] text-slate-400 dark:text-zinc-500 opacity-80">{cat.type === 'ESSENTIAL' ? 'Essential' : 'Extra'}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Date */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-1">Date</label>
                <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-sm font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-yellow-400 outline-none"
                />
            </div>

            <button 
                type="submit" 
                className="w-full bg-slate-900 dark:bg-yellow-400 text-white dark:text-black font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-yellow-300 transition-transform active:scale-95"
            >
                Save Expense
            </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;