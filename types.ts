export type AccountType = 'CASH' | 'BANK_BOC' | 'BANK_PEOPLES' | 'BANK_OTHER';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number; // For manual tracking, though user focused on expenses
}

export type CategoryType = 'ESSENTIAL' | 'NON_ESSENTIAL';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO String
  description: string;
  accountId: string;
  categoryId: string;
  type: 'EXPENSE' | 'INCOME';
}

export type CalendarViewMode = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface DailySummary {
  date: string;
  total: number;
  essential: number;
  nonEssential: number;
}