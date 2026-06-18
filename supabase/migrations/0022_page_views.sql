-- ============================================
-- 방문자 통계 — 자체 페이지뷰 기록 테이블
-- 실행 위치: Supabase Dashboard → SQL Editor (또는 관리 API로 직접 실행)
--
-- 개인정보 비식별: 원본 IP는 저장하지 않고, 하루 단위로 회전하는
-- 익명 해시(visitor_hash)만 저장 → "오늘의 방문자 수"는 셀 수 있지만
-- 날짜를 넘어 개인을 추적할 수는 없음.
-- 기록(insert)은 service_role(API route)만 수행, 조회는 관리자만.
-- ============================================

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  referrer_host text,                          -- 유입 도메인 (예: m.search.naver.com), 없으면 null
  device text not null default 'unknown',      -- 'pc' | 'mobile' | 'tablet' | 'unknown'
  visitor_hash text not null,                  -- 일별 회전 익명 해시 (개인정보 아님)
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created_at on public.page_views (created_at desc);
create index if not exists idx_page_views_path on public.page_views (path);

alter table public.page_views enable row level security;

-- 조회: 관리자만 (대시보드 통계용)
drop policy if exists "page_views admin read" on public.page_views;
create policy "page_views admin read" on public.page_views
  for select to authenticated using (public.is_admin());

-- insert 정책 없음 → anon/authenticated 모두 직접 insert 불가.
-- 기록은 service_role 키를 쓰는 API route(/api/track)에서만 수행되며 RLS를 우회함.
