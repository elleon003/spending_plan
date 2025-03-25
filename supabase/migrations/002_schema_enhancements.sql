-- Categories Table
create table if not exists categories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    name text not null,
    type text not null check (type in ('income', 'expense')),
    is_system boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, name)
);

-- Recurring Transactions Table
create table if not exists recurring_transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    account_id uuid references bank_accounts(id) not null,
    category_id uuid references categories(id) not null,
    amount decimal(12,2) not null,
    description text not null,
    frequency text not null check (frequency in ('weekly', 'biweekly', 'monthly', 'yearly')),
    start_date date not null,
    end_date date,
    last_generated_date date,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Add category_id to transactions table
alter table transactions 
add column category_id uuid references categories(id);

-- Add constraints to existing tables
alter table transactions
add constraint positive_amount check (amount > 0),
add constraint valid_date check (date <= current_date);

alter table budgets
add constraint positive_budget check (amount >= 0);

-- Enable RLS on new tables
alter table categories enable row level security;
alter table recurring_transactions enable row level security;

-- RLS Policies for categories
create policy "Users can view their own categories"
    on categories for select
    using (auth.uid() = user_id or is_system = true);

create policy "Users can manage their own categories"
    on categories for all
    using (auth.uid() = user_id and is_system = false);

-- RLS Policies for recurring transactions
create policy "Users can view their own recurring transactions"
    on recurring_transactions for select
    using (auth.uid() = user_id);

create policy "Users can manage their own recurring transactions"
    on recurring_transactions for all
    using (auth.uid() = user_id);

-- Add trigger for recurring_transactions
create trigger update_recurring_transactions_updated_at
    before update on recurring_transactions
    for each row
    execute function update_updated_at_column();

-- Add trigger for categories
create trigger update_categories_updated_at
    before update on categories
    for each row
    execute function update_updated_at_column();
