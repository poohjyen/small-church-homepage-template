-- 0011: notices 테이블에서 교회일정(category='schedule')을 별도 schedules 테이블로 분리
-- 사용자 결정 (2026-05-09): UI만 분리에서 → DB 테이블도 분리

-- 1. 신규 schedules 테이블 (notices와 같은 컬럼, category 제외)
create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean default false,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_schedules_created_at on public.schedules(created_at desc);
create index if not exists idx_schedules_pinned on public.schedules(is_pinned desc, created_at desc);

-- 2. RLS 정책 (notices와 동일 패턴)
alter table public.schedules enable row level security;

drop policy if exists "schedules_public_read" on public.schedules;
create policy "schedules_public_read" on public.schedules for select using (true);

drop policy if exists "schedules_admin_write" on public.schedules;
create policy "schedules_admin_write"
  on public.schedules
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 3. 기존 category='schedule' row 이전
insert into public.schedules (id, title, content, is_pinned, view_count, created_at, updated_at)
select id, title, content, is_pinned, view_count, created_at, updated_at
from public.notices
where category = 'schedule';

-- 4. notices에서 schedule row 삭제
delete from public.notices where category = 'schedule';

-- 5. notices.category 컬럼 제거 (모두 'news'였던 것이 default이므로 무리 없음)
drop index if exists idx_notices_category;
alter table public.notices drop column if exists category;
