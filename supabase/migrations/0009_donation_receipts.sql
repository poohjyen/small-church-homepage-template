-- 기부금 영수증 신청
create table donation_receipts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  birthdate date not null,
  phone text not null,
  address text not null,
  delivery_method text not null check (delivery_method in ('pickup', 'email', 'fax')),
  delivery_email text,
  delivery_fax text,
  note text,
  status text default 'new',
  admin_memo text,
  created_at timestamptz default now()
);

alter table donation_receipts enable row level security;

create policy "Anyone submit donation_receipts" on donation_receipts
  for insert to anon, authenticated with check (true);
create policy "Admin read donation_receipts" on donation_receipts
  for select to authenticated using (is_admin());
create policy "Admin update donation_receipts" on donation_receipts
  for update to authenticated using (is_admin());
create policy "Admin delete donation_receipts" on donation_receipts
  for delete to authenticated using (is_admin());
