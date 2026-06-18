-- 심방요청 4분류 (가정/병문안/사업장/기타) — 매화 패턴 적용
-- visit_requests.visit_type 컬럼 추가. 기존 행은 '가정'으로 백필.

alter table public.visit_requests
  add column if not exists visit_type text not null default '가정';

alter table public.visit_requests
  drop constraint if exists visit_requests_visit_type_check;

alter table public.visit_requests
  add constraint visit_requests_visit_type_check
  check (visit_type in ('가정', '병문안', '사업장', '기타'));
