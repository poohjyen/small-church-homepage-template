-- 주보 PDF → 페이지 이미지 자동 변환: 페이지 이미지 URL 배열 (배열 순서 = 페이지 순서)
alter table public.bulletins
  add column if not exists page_image_urls jsonb not null default '[]'::jsonb;

alter table public.bulletins
  add constraint bulletins_page_image_urls_is_array
  check (jsonb_typeof(page_image_urls) = 'array');
