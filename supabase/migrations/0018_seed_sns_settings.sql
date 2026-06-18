-- ============================================
-- SNS 링크(site_settings.sns) 시드 / 업서트
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
--
-- 효과: Header/Footer의 SNS 아이콘이 admin UI 등록 없이도 즉시 활성화됩니다.
--       이후 admin > 설정 > SNS 에서 수정하면 이 값을 덮어씁니다.
-- ============================================

-- 빈 SNS 시드 — /setup-church(build-seed-sql) 또는 admin > 설정 > SNS에서 채웁니다.
insert into public.site_settings (key, value)
values (
  'sns',
  jsonb_build_object('band', '', 'youtube', '', 'instagram', '')
)
on conflict (key) do nothing;
