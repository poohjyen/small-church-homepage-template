-- 유튜브 자동 동기화 설정 (빈 시드)
-- playlist_id / default_preacher 는 admin > 설정 또는 SQL Editor에서 교회가 입력합니다.
-- (YOUTUBE_API_KEY 환경변수가 있어야 실제 동기화가 동작 — 없으면 기능 비활성)

insert into public.site_settings (key, value)
values ('youtube_sermon_sync', jsonb_build_object(
  'playlist_id', '',
  'default_preacher', ''))
on conflict (key) do nothing;

insert into public.site_settings (key, value)
values ('youtube_video_sync', jsonb_build_object(
  'playlist_id', ''))
on conflict (key) do nothing;
