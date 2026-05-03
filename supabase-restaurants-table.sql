-- Run this in your Supabase SQL Editor

create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  cuisine text,
  tagline text,
  description text,
  address text,
  phone text,
  hours text,
  pickup_time text default '15-20',
  currency text default 'SAR',
  emoji text default '🏪',
  design jsonb,
  status text default 'active',
  created_at timestamptz default now()
);

-- Enable public access
alter table restaurants enable row level security;
create policy "Public read restaurants" on restaurants for select using (true);
create policy "Public insert restaurants" on restaurants for insert with check (true);
create policy "Public update restaurants" on restaurants for update using (true);
create policy "Public delete restaurants" on restaurants for delete using (true);

-- Add restaurant_id index for performance
create index if not exists menu_items_restaurant_id_idx on menu_items(restaurant_id);
create index if not exists orders_restaurant_id_idx on orders(restaurant_id);
