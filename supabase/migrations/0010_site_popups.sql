-- 0009: site_popups — 메인/공개 페이지에 노출되는 이미지 팝업
-- 기간(starts_at/ends_at) 자동 노출/내림, 위치(center/corners), 우선순위, 페이지별 매칭

create table if not exists site_popups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  image_alt text,
  link_url text,
  link_target text not null default '_self' check (link_target in ('_self', '_blank')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  position text not null default 'center' check (
    position in ('center', 'top-right', 'bottom-right', 'top-left', 'bottom-left')
  ),
  width integer not null default 480 check (width between 200 and 1200),
  width_mobile integer not null default 320 check (width_mobile between 200 and 600),
  display_priority integer not null default 0,
  show_dont_show_today boolean not null default true,
  show_close_button boolean not null default true,
  pages text[] not null default '{"/"}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_site_popups_active_period
  on site_popups (is_active, starts_at, ends_at);

create index if not exists idx_site_popups_priority
  on site_popups (display_priority desc, starts_at desc);

alter table site_popups enable row level security;

drop policy if exists "site_popups public read" on site_popups;
create policy "site_popups public read"
  on site_popups for select
  using (
    is_active = true
    and now() >= starts_at
    and now() <= ends_at
  );

drop policy if exists "site_popups admin all" on site_popups;
create policy "site_popups admin all"
  on site_popups for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

comment on table site_popups is '메인/공개 페이지 이미지 팝업. 기간·위치·우선순위·페이지별 매칭 지원';

-- Storage 버킷 (idempotent)
insert into storage.buckets (id, name, public)
  values ('popups', 'popups', true)
  on conflict (id) do nothing;

drop policy if exists "popups public read" on storage.objects;
create policy "popups public read"
  on storage.objects for select
  using (bucket_id = 'popups');

drop policy if exists "popups admin write" on storage.objects;
create policy "popups admin write"
  on storage.objects for all
  using (bucket_id = 'popups' and auth.role() = 'authenticated')
  with check (bucket_id = 'popups' and auth.role() = 'authenticated');
