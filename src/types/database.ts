export type PayPeriodFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly'

export interface PayPeriod {
  id: string
  user_id: string
  frequency: PayPeriodFrequency
  start_date: string
  created_at: string
  updated_at: string
}

export interface BankAccount {
  id: string
  user_id: string
  plaid_account_id: string
  name: string
  mask: string | null
  type: string
  subtype: string | null
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  pay_period_id: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  plaid_transaction_id: string | null
  account_id: string
  amount: number
  category: string | null
  date: string
  description: string
  pending: boolean
  category_id: string | null
  created_at: string
  updated_at: string
}

export interface PlaidToken {
  id: string
  user_id: string
  access_token: string
  item_id: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  is_system: boolean
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  account_id: string
  category_id: string
  amount: number
  description: string
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly'
  start_date: string
  end_date: string | null
  last_generated_date: string | null
  created_at: string
  updated_at: string
}

// Type for the complete Database structure
export interface Database {
  pay_periods: PayPeriod
  bank_accounts: BankAccount
  budgets: Budget
  transactions: Transaction
  plaid_tokens: PlaidToken
  categories: Category
  recurring_transactions: RecurringTransaction
}

// Helper type for Supabase row-level types
export type Tables<T extends keyof Database> = Database[T]
