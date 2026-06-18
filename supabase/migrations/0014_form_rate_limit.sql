-- ============================================
-- 공개 폼 제출 Rate Limit (Supabase 자체 구현)
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
-- ============================================

-- 1. 제출 로그 테이블 (IP + form_key + 시각)
create table if not exists public.form_submissions_log (
  id bigserial primary key,
  ip text not null,
  form_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_form_log_lookup
  on public.form_submissions_log (form_key, ip, created_at desc);

alter table public.form_submissions_log enable row level security;

-- 직접 조회는 관리자만 허용 (모니터링/디버깅 용도)
drop policy if exists "Admin read form log" on public.form_submissions_log;
create policy "Admin read form log"
  on public.form_submissions_log for select
  to authenticated
  using (is_admin());

-- 2. Rate limit 체크 + 카운터 증가를 한 트랜잭션으로 처리하는 RPC
--    SECURITY DEFINER로 anon 사용자도 RLS 우회하여 insert 가능
create or replace function public.check_and_consume_rate_limit(
  p_ip text,
  p_form_key text,
  p_limit int default 5,
  p_window_seconds int default 300
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  select count(*) into v_count
  from public.form_submissions_log
  where ip = p_ip
    and form_key = p_form_key
    and created_at > now() - (p_window_seconds || ' seconds')::interval;

  if v_count >= p_limit then
    return false;
  end if;

  insert into public.form_submissions_log (ip, form_key)
  values (p_ip, p_form_key);

  return true;
end;
$$;

revoke all on function public.check_and_consume_rate_limit(text, text, int, int) from public;
grant execute on function public.check_and_consume_rate_limit(text, text, int, int) to anon, authenticated;
