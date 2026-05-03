-- ============================================
-- 특별영상(찬양·간증·행사 등) 게시판
-- ============================================

create table videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '특별영상',
  youtube_id text not null,
  description text,
  performer text,
  video_date date not null,
  display_order int default 0,
  created_at timestamptz default now()
);

alter table videos enable row level security;

create policy "Public read videos" on videos for select to anon, authenticated using (true);
create policy "Admin insert videos" on videos for insert to authenticated with check (is_admin());
create policy "Admin update videos" on videos for update to authenticated using (is_admin());
create policy "Admin delete videos" on videos for delete to authenticated using (is_admin());

create index videos_date_idx on videos (video_date desc);
create index videos_category_idx on videos (category);
