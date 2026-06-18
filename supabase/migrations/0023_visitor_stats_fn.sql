-- ============================================
-- 방문자 통계 집계 함수 — 대시보드용
-- 한국시간(Asia/Seoul) 기준 날짜로 집계.
-- security definer 미사용 → 호출자 권한으로 실행되며 page_views RLS가 적용됨
-- (관리자만 데이터가 보이고, 비관리자는 0으로 집계됨 → 정보 노출 없음).
-- ============================================

create or replace function public.get_visitor_stats(days int default 7)
returns jsonb
language sql
stable
set search_path = public
as $$
  with bounds as (
    select
      ((now() at time zone 'Asia/Seoul')::date - (days - 1)) as start_day,
      (now() at time zone 'Asia/Seoul')::date as today_day
  ),
  rows as (
    select
      (pv.created_at at time zone 'Asia/Seoul')::date as d,
      pv.path,
      pv.referrer_host,
      pv.device,
      pv.visitor_hash
    from public.page_views pv, bounds b
    where (pv.created_at at time zone 'Asia/Seoul')::date >= b.start_day
  ),
  daily as (
    select d, count(*) as views, count(distinct visitor_hash) as visitors
    from rows group by d
  ),
  series as (
    select generate_series(b.start_day::timestamp, b.today_day::timestamp, '1 day')::date as d
    from bounds b
  )
  select jsonb_build_object(
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'date', to_char(s.d, 'YYYY-MM-DD'),
        'views', coalesce(dd.views, 0),
        'visitors', coalesce(dd.visitors, 0)
      ) order by s.d), '[]'::jsonb)
      from series s left join daily dd on dd.d = s.d
    ),
    'today', coalesce(
      (select jsonb_build_object('views', dd.views, 'visitors', dd.visitors)
       from daily dd, bounds b where dd.d = b.today_day),
      jsonb_build_object('views', 0, 'visitors', 0)
    ),
    'yesterday', coalesce(
      (select jsonb_build_object('views', dd.views, 'visitors', dd.visitors)
       from daily dd, bounds b where dd.d = b.today_day - 1),
      jsonb_build_object('views', 0, 'visitors', 0)
    ),
    'last7', jsonb_build_object(
      'views', (select count(*) from rows),
      'visitors', (select count(distinct visitor_hash) from rows)
    ),
    'topPages', (
      select coalesce(jsonb_agg(t order by t.views desc), '[]'::jsonb) from (
        select path, count(*) as views from rows group by path order by count(*) desc limit 5
      ) t
    ),
    'topReferrers', (
      select coalesce(jsonb_agg(t order by t.count desc), '[]'::jsonb) from (
        select referrer_host as host, count(*) as count
        from rows where referrer_host is not null
        group by referrer_host order by count(*) desc limit 5
      ) t
    ),
    'devices', (
      select jsonb_build_object(
        'pc', count(*) filter (where device = 'pc'),
        'mobile', count(*) filter (where device = 'mobile'),
        'tablet', count(*) filter (where device = 'tablet'),
        'unknown', count(*) filter (where device = 'unknown')
      ) from rows
    ),
    'total', (select count(*) from rows)
  );
$$;

revoke all on function public.get_visitor_stats(int) from public, anon;
grant execute on function public.get_visitor_stats(int) to authenticated;
