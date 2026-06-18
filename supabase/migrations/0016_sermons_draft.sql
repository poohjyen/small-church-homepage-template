-- ============================================
-- sermons.is_draft 컬럼 + 유튜브 동기화 설정 + 대시보드 인사말 이름
-- 실행 위치: Supabase Dashboard → SQL Editor → New query (또는 supabase db push)
-- ============================================

-- 1. sermons 테이블에 초안(draft) 플래그 추가
alter table public.sermons
  add column if not exists is_draft boolean not null default false;

-- 공개 sermons 조회 + draft 카운트 인덱스
create index if not exists idx_sermons_is_draft_date
  on public.sermons (is_draft, sermon_date desc);

-- 2. 유튜브 재생목록 자동 동기화 설정 (빈 시드)
--    실제 playlist_id는 admin 설정 페이지 또는 SQL Editor에서 입력
insert into public.site_settings (key, value)
values (
  'youtube_sermon_sync',
  '{"playlist_id": "", "default_preacher": ""}'::jsonb
)
on conflict (key) do nothing;

-- 3. 대시보드/표기용 관리자 이름 (빈 시드 — setup가 담임목사명으로 채움)
insert into public.site_settings (key, value)
values ('admin_name', '""'::jsonb)
on conflict (key) do nothing;
