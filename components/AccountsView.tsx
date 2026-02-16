import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import { IconBank, IconCard, IconCash, IconPlus } from './ui/Icons';
import { Account, AccountType } from '../types';

const AccountsView: React.FC = () => {
  const { accounts, addAccount, updateAccountBalance } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState<AccountType>('BANK_OTHER');

  // Edit Balance Modal State
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editBalanceValue, setEditBalanceValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName) return;
    addAccount({
        id: `acc_${Date.now()}`,
        name: newAccName,
        type: newAccType,
        balance: 0
    });
    setShowAdd(false);
    setNewAccName('');
  };

  const openEditBalance = (account: Account) => {
      setEditingAccount(account);
      setEditBalanceValue(account.balance.toString());
  };

  const handleUpdateBalance = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingAccount && editBalanceValue) {
          updateAccountBalance(editingAccount.id, parseFloat(editBalanceValue));
          setEditingAccount(null);
          setEditBalanceValue('');
      }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sources</h1>
            <button onClick={() => setShowAdd(!showAdd)} className="text-indigo-600 dark:text-yellow-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 p-2 rounded-full">
                <IconPlus className="w-6 h-6" />
            </button>
        </div>

        {showAdd && (
            <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 animate-fade-in space-y-3">
                <input 
                    type="text" 
                    placeholder="Account Name (e.g., Savings)" 
                    className="w-full p-2 border dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 dark:text-white"
                    value={newAccName}
                    onChange={e => setNewAccName(e.target.value)}
                />
                <select 
                    value={newAccType} 
                    onChange={e => setNewAccType(e.target.value as AccountType)}
                    className="w-full p-2 border dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 dark:text-white"
                >
                    <option value="BANK_OTHER">Other Bank</option>
                    <option value="BANK_BOC">BOC Bank</option>
                    <option value="BANK_PEOPLES">People's Bank</option>
                    <option value="CASH">Cash Stash</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 dark:bg-yellow-400 text-white dark:text-black py-2 rounded-lg text-sm font-bold">Add Source</button>
            </form>
        )}

        <div className="space-y-3">
            {accounts.map(acc => (
                <div key={acc.id} className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-800 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full 
                            ${acc.type === 'CASH' 
                                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                                : acc.type === 'BANK_BOC' 
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                    : acc.type === 'BANK_PEOPLES'
                                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {acc.type === 'CASH' ? <IconCash /> : (acc.type === 'BANK_BOC' || acc.type === 'BANK_PEOPLES') ? <IconBank /> : <IconCard />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{acc.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 capitalize">{acc.type.replace('BANK_', '').replace('_', ' ').toLowerCase()}</p>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <p className="text-xs text-slate-400 dark:text-zinc-500">Available</p>
                        <p className="font-bold text-lg text-slate-800 dark:text-white">Rs. {acc.balance.toLocaleString()}</p>
                        <button 
                            onClick={() => openEditBalance(acc)}
                            className="text-[10px] text-indigo-600 dark:text-yellow-400 font-medium hover:underline mt-1"
                        >
                            Update Balance
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Edit Balance Modal */}
        {editingAccount && (
            <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-slide-up">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Update Balance</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                        Set the current money available in <span className="font-bold text-slate-700 dark:text-zinc-300">{editingAccount.name}</span>.
                    </p>
                    
                    <form onSubmit={handleUpdateBalance}>
                        <div className="relative mb-6">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 font-bold">Rs</span>
                            <input 
                                type="number" 
                                value={editBalanceValue}
                                onChange={(e) => setEditBalanceValue(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-950 border-none rounded-xl text-xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-yellow-400 outline-none"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button 
                                type="button" 
                                onClick={() => setEditingAccount(null)}
                                className="flex-1 py-3 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl font-semibold text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-1 py-3 bg-indigo-600 dark:bg-yellow-400 text-white dark:text-black rounded-xl font-bold text-sm"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default AccountsView;