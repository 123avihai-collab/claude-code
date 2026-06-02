-- =============================================================
-- אפליקציית כלכלת בית — סכמת בסיס נתונים ראשונית
-- כולל: טבלאות, RLS, view לסיכום חודשי, trigger ליצירת פרופיל
-- וקטגוריות ברירת מחדל למשתמש חדש.
-- הריצו ב-Supabase SQL Editor או דרך `supabase db push`.
-- =============================================================

-- ---------- enum סוג תנועה ----------
do $$ begin
  create type public.tx_type as enum ('income', 'expense');
exception when duplicate_object then null; end $$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  currency     text not null default 'ILS',
  created_at   timestamptz not null default now()
);

-- ---------- categories ----------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        public.tx_type not null,
  color       text,
  icon        text,
  is_archived boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (user_id, name, type)
);

-- ---------- transactions ----------
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  type        public.tx_type not null,
  amount      numeric(12,2) not null check (amount >= 0),
  occurred_on date not null,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on public.transactions (user_id, occurred_on);
create index if not exists transactions_user_cat_idx  on public.transactions (user_id, category_id);

-- ---------- budgets ----------
create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  month       date not null,             -- תמיד ה-1 בחודש
  amount      numeric(12,2) not null check (amount >= 0),
  created_at  timestamptz not null default now(),
  unique (user_id, category_id, month)
);

-- =============================================================
-- Row Level Security — כל משתמש רואה ומשנה רק את הנתונים שלו
-- =============================================================
alter table public.profiles     enable row level security;
alter table public.categories   enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets      enable row level security;

-- profiles (השוואה מול id)
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_mutate" on public.profiles;
create policy "profiles_mutate" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- מאקרו ידני לשאר הטבלאות (user_id)
drop policy if exists "categories_select" on public.categories;
create policy "categories_select" on public.categories
  for select using (auth.uid() = user_id);
drop policy if exists "categories_mutate" on public.categories;
create policy "categories_mutate" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "transactions_select" on public.transactions;
create policy "transactions_select" on public.transactions
  for select using (auth.uid() = user_id);
drop policy if exists "transactions_mutate" on public.transactions;
create policy "transactions_mutate" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "budgets_select" on public.budgets;
create policy "budgets_select" on public.budgets
  for select using (auth.uid() = user_id);
drop policy if exists "budgets_mutate" on public.budgets;
create policy "budgets_mutate" on public.budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =============================================================
-- View: סיכום הוצאות חודשי לפי קטגוריה (תמיד מעודכן)
-- =============================================================
create or replace view public.v_monthly_category_spend
with (security_invoker = true) as
  select
    user_id,
    category_id,
    date_trunc('month', occurred_on)::date as month,
    sum(amount) as spent
  from public.transactions
  where type = 'expense'
  group by user_id, category_id, date_trunc('month', occurred_on);

-- =============================================================
-- Trigger: יצירת פרופיל + קטגוריות ברירת מחדל למשתמש חדש
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));

  -- קטגוריות הוצאה
  insert into public.categories (user_id, name, type, color) values
    (new.id, 'מזון',     'expense', '#ef4444'),
    (new.id, 'דיור',     'expense', '#f97316'),
    (new.id, 'רכב',      'expense', '#eab308'),
    (new.id, 'חשבונות',  'expense', '#3b82f6'),
    (new.id, 'פנאי',     'expense', '#a855f7'),
    (new.id, 'בריאות',   'expense', '#ec4899'),
    (new.id, 'חינוך',    'expense', '#14b8a6'),
    (new.id, 'אחר',      'expense', '#6b7280');

  -- קטגוריות הכנסה
  insert into public.categories (user_id, name, type, color) values
    (new.id, 'משכורת',   'income', '#22c55e'),
    (new.id, 'הכנסה אחרת','income', '#10b981');

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
