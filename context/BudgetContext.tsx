import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Account, Category } from '../types';

interface BudgetContextType {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Account) => void;
  updateAccountBalance: (id: string, newBalance: number) => void;
  getAccountName: (id: string) => string;
  getCategoryName: (id: string) => string;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Initial Seed Data
const INITIAL_ACCOUNTS: Account[] = [
  { id: 'acc_1', name: 'Wallet Cash', type: 'CASH', balance: 5000 },
  { id: 'acc_2', name: 'BOC Account', type: 'BANK_BOC', balance: 25000 },
  { id: 'acc_3', name: "People's Bank", type: 'BANK_PEOPLES', balance: 15000 },
];

const INITIAL_CATEGORIES: Category[] = [
  // Essential Categories
  { id: 'cat_e_1', name: 'Food/Dining', type: 'ESSENTIAL' },
  { id: 'cat_e_2', name: 'Transport', type: 'ESSENTIAL' },
  { id: 'cat_e_3', name: 'University', type: 'ESSENTIAL' },
  { id: 'cat_e_4', name: 'Other', type: 'ESSENTIAL' },

  // Non-Essential / Extra Categories
  { id: 'cat_n_1', name: 'Passion', type: 'NON_ESSENTIAL' },
  { id: 'cat_n_2', name: 'Foods', type: 'NON_ESSENTIAL' },
  { id: 'cat_n_3', name: 'Transport', type: 'NON_ESSENTIAL' },
  { id: 'cat_n_4', name: 'Other', type: 'NON_ESSENTIAL' },
];

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sb_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('sb_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    localStorage.setItem('sb_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sb_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    
    // Update account balance
    if (t.type === 'EXPENSE') {
      setAccounts(prev => prev.map(acc => 
        acc.id === t.accountId 
          ? { ...acc, balance: acc.balance - t.amount } 
          : acc
      ));
    } else if (t.type === 'INCOME') {
      setAccounts(prev => prev.map(acc => 
        acc.id === t.accountId 
          ? { ...acc, balance: acc.balance + t.amount } 
          : acc
      ));
    }
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      // Revert balance change
      if (transaction.type === 'EXPENSE') {
          setAccounts(prev => prev.map(acc => 
              acc.id === transaction.accountId 
                  ? { ...acc, balance: acc.balance + transaction.amount } 
                  : acc
          ));
      } else if (transaction.type === 'INCOME') {
          setAccounts(prev => prev.map(acc => 
              acc.id === transaction.accountId 
                  ? { ...acc, balance: acc.balance - transaction.amount } 
                  : acc
          ));
      }
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = (a: Account) => {
    setAccounts(prev => [...prev, a]);
  };

  const updateAccountBalance = (id: string, newBalance: number) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, balance: newBalance } : acc));
  };

  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Unknown Account';
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Unknown Category';

  return (
    <BudgetContext.Provider value={{ 
      transactions, 
      accounts, 
      categories, 
      addTransaction, 
      deleteTransaction,
      addAccount,
      updateAccountBalance,
      getAccountName,
      getCategoryName
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within a BudgetProvider');
  return context;
};