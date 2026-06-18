-- ============================================
-- SNS 링크(site_settings.sns) 시드 / 업서트
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
--
-- 효과: Header/Footer의 SNS 아이콘이 admin UI 등록 없이도 즉시 활성화됩니다.
--       이후 admin > 설정 > SNS 에서 수정하면 이 값을 덮어씁니다.
-- ============================================

insert into public.site_settings (key, value)
values (
  'sns',
  jsonb_build_object(
    'band',      'https://band.us/@dreamch',
    'youtube',   'https://www.youtube.com/@church_dream',
    'instagram', 'https://www.instagram.com/dj.dreamch/'
  )
)
on conflict (key) do update
set value = excluded.value,
    updated_at = now();
