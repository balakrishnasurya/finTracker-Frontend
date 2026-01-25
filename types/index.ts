export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  type: TransactionType;
  paymentType?: string;
  createdAt: string;
}

export interface CategoryWithTransactions extends Category {
  transactions: Transaction[];
  totalAmount: number;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface Streak {
  id: number;
  name: string;
  currentCount: number;
  longestCount: number;
  lastUpdated: string;
}
