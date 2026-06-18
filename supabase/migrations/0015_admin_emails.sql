-- ============================================
-- Admin 식별을 SQL 하드코딩 → site_settings 기반 동적 참조로 변경
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
--
-- ⚠️  이 마이그레이션 적용 후 admin 진입이 막히지 않도록
--     반드시 시드 INSERT가 먼저 실행되어야 합니다.
-- ============================================

-- 1. site_settings에 admin_emails 시드 (JSONB 배열)
--    기존 'admin_email'(단수, 알림 수신용)과는 별도의 키
insert into public.site_settings (key, value)
values (
  'admin_emails',
  '["dream@dreamch.org", "poohjyen@gmail.com"]'::jsonb
)
on conflict (key) do nothing;

-- 2. is_admin() 함수를 admin_emails 참조하도록 교체
--    JSONB 배열에 사용자 이메일이 포함됐는지 ? 연산자로 확인
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_emails jsonb;
begin
  v_email := auth.jwt() ->> 'email';
  if v_email is null then
    return false;
  end if;

  select value into v_emails
  from public.site_settings
  where key = 'admin_emails';

  if v_emails is null then
    -- 시드 미적용 등 fallback: 기존 동작 유지
    return v_email = 'poohjyen@gmail.com';
  end if;

  return v_emails ? v_email;
end;
$$;
