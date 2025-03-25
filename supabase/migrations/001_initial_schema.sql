-- Enable Row Level Security
alter table if exists pay_periods enable row level security;
alter table if exists bank_accounts enable row level security;
alter table if exists budgets enable row level security;
alter table if exists transactions enable row level security;
alter table if exists plaid_tokens enable row level security;

-- Pay Periods Table
create table if not exists pay_periods (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    frequency text not null check (frequency in ('weekly', 'biweekly', 'semimonthly', 'monthly')),
    start_date date not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Bank Accounts Table
create table if not exists bank_accounts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    plaid_account_id text not null,
    name text not null,
    mask text,
    type text not null,
    subtype text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, plaid_account_id)
);

-- Budgets Table
create table if not exists budgets (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    category text not null,
    amount decimal(12,2) not null,
    pay_period_id uuid references pay_periods(id) not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Transactions Table
create table if not exists transactions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    plaid_transaction_id text unique,
    account_id uuid references bank_accounts(id) not null,
    amount decimal(12,2) not null,
    category text,
    date date not null,
    description text not null,
    pending boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Plaid Tokens Table (Encrypted)
create table if not exists plaid_tokens (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) unique not null,
    access_token text not null,
    item_id text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- RLS Policies
-- Pay Periods
create policy "Users can view their own pay periods"
    on pay_periods for select
    using (auth.uid() = user_id);

create policy "Users can insert their own pay periods"
    on pay_periods for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own pay periods"
    on pay_periods for update
    using (auth.uid() = user_id);

-- Bank Accounts
create policy "Users can view their own bank accounts"
    on bank_accounts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own bank accounts"
    on bank_accounts for insert
    with check (auth.uid() = user_id);

-- Budgets
create policy "Users can view their own budgets"
    on budgets for select
    using (auth.uid() = user_id);

create policy "Users can manage their own budgets"
    on budgets for all
    using (auth.uid() = user_id);

-- Transactions
create policy "Users can view their own transactions"
    on transactions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on transactions for insert
    with check (auth.uid() = user_id);

-- Plaid Tokens
create policy "Users can view their own Plaid tokens"
    on plaid_tokens for select
    using (auth.uid() = user_id);

create policy "Users can insert their own Plaid tokens"
    on plaid_tokens for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own Plaid tokens"
    on plaid_tokens for update
    using (auth.uid() = user_id);

-- Create indexes for better performance
create index if not exists idx_transactions_user_date 
    on transactions(user_id, date);

create index if not exists idx_budgets_user_period 
    on budgets(user_id, pay_period_id);

-- Add triggers for updated_at columns
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_pay_periods_updated_at
    before update on pay_periods
    for each row
    execute function update_updated_at_column();

create trigger update_bank_accounts_updated_at
    before update on bank_accounts
    for each row
    execute function update_updated_at_column();

create trigger update_budgets_updated_at
    before update on budgets
    for each row
    execute function update_updated_at_column();

create trigger update_transactions_updated_at
    before update on transactions
    for each row
    execute function update_updated_at_column();

create trigger update_plaid_tokens_updated_at
    before update on plaid_tokens
    for each row
    execute function update_updated_at_column();
