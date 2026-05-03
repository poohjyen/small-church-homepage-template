-- 0007: page_blocks — 페이지별 콘텐츠 블록 (heading/paragraph/image)
-- missions/about 등 페이지에서 텍스트+이미지 블록을 자유롭게 추가/순서 변경 가능

create table if not exists page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  type text not null check (type in ('heading','paragraph','image')),
  title text,
  body text,
  image_url text,
  image_alt text,
  display_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_page_blocks_page_order
  on page_blocks(page_key, display_order);

alter table page_blocks enable row level security;

drop policy if exists "page_blocks public read" on page_blocks;
create policy "page_blocks public read"
  on page_blocks for select
  using (true);

drop policy if exists "page_blocks admin all" on page_blocks;
create policy "page_blocks admin all"
  on page_blocks for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

comment on table page_blocks is '페이지(missions, about 등)별 콘텐츠 블록. type=heading|paragraph|image';
