-- ============================================
-- 교회 홈페이지 DB 스키마 (v1)
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
-- ============================================

-- ============================================
-- 관리자 사용자 테이블 + 판별 함수
-- ============================================
-- admin_users에 등록된 이메일은 모든 RLS 정책에서 관리자 권한을 가집니다.
-- setup-church Skill이 인터뷰 답변(관리자 이메일)을 INSERT 합니다.
-- 추가 관리자는 admin/admin-users 페이지 또는 Dashboard에서 수동 INSERT.
create table admin_users (
  email text primary key,
  display_name text,
  created_at timestamptz default now()
);

create or replace function is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from admin_users
    where email = auth.jwt() ->> 'email'
  );
end;
$$;

-- ============================================
-- 테이블
-- ============================================

-- 공지사항
create table notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_pinned boolean default false,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 주일설교
create table sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scripture text,
  preacher text,
  youtube_id text not null,
  summary text,
  sermon_date date not null,
  created_at timestamptz default now()
);

-- 목양칼럼
create table pastoral_columns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author text,
  published_date date not null,
  created_at timestamptz default now()
);

-- 주보
create table bulletins (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  pdf_url text not null,
  thumbnail_url text,
  bulletin_date date not null,
  created_at timestamptz default now()
);

-- 갤러리 앨범
create table galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  cover_image text,
  event_date date,
  created_at timestamptz default now()
);

-- 갤러리 사진
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid references galleries(id) on delete cascade,
  image_url text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 자료실
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text,
  file_url text not null,
  file_size int,
  download_count int default 0,
  created_at timestamptz default now()
);

-- 새가족 등록
create table newcomer_forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  birthdate date,
  address text,
  family_info text,
  visit_reason text,
  previous_church text,
  status text default 'new',
  admin_memo text,
  created_at timestamptz default now()
);

-- 기도제목
create table prayer_requests (
  id uuid primary key default gen_random_uuid(),
  is_anonymous boolean default false,
  name text,
  phone text,
  content text not null,
  status text default 'new',
  admin_memo text,
  created_at timestamptz default now()
);

-- 심방 요청
create table visit_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  address text not null,
  requested_date date,
  requested_time text,
  reason text,
  status text default 'new',
  admin_memo text,
  created_at timestamptz default now()
);

-- 사이트 설정
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 히어로 슬라이드
create table hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text,
  subtitle text,
  display_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- RLS 활성화
-- ============================================
alter table admin_users enable row level security;
alter table notices enable row level security;
alter table sermons enable row level security;
alter table pastoral_columns enable row level security;
alter table bulletins enable row level security;
alter table galleries enable row level security;
alter table gallery_images enable row level security;
alter table resources enable row level security;
alter table newcomer_forms enable row level security;
alter table prayer_requests enable row level security;
alter table visit_requests enable row level security;
alter table site_settings enable row level security;
alter table hero_slides enable row level security;

-- ============================================
-- RLS 정책 — admin_users
-- ============================================
-- 본인 이메일에 해당하는 행만 조회 가능 (관리자 본인 식별 용도)
create policy "Admin self read" on admin_users for select to authenticated
  using (auth.jwt() ->> 'email' = email);
-- 등록/삭제는 service_role 키로만 (앱 사용자 토큰으로는 불가)
-- service_role 키는 RLS를 우회하므로 별도 정책 불필요

-- ============================================
-- RLS 정책 — 콘텐츠 (공개 읽기 + 관리자 쓰기)
-- ============================================

-- Notices
create policy "Public read notices" on notices for select to anon, authenticated using (true);
create policy "Admin insert notices" on notices for insert to authenticated with check (is_admin());
create policy "Admin update notices" on notices for update to authenticated using (is_admin());
create policy "Admin delete notices" on notices for delete to authenticated using (is_admin());

-- Sermons
create policy "Public read sermons" on sermons for select to anon, authenticated using (true);
create policy "Admin insert sermons" on sermons for insert to authenticated with check (is_admin());
create policy "Admin update sermons" on sermons for update to authenticated using (is_admin());
create policy "Admin delete sermons" on sermons for delete to authenticated using (is_admin());

-- Pastoral Columns
create policy "Public read columns" on pastoral_columns for select to anon, authenticated using (true);
create policy "Admin insert columns" on pastoral_columns for insert to authenticated with check (is_admin());
create policy "Admin update columns" on pastoral_columns for update to authenticated using (is_admin());
create policy "Admin delete columns" on pastoral_columns for delete to authenticated using (is_admin());

-- Bulletins
create policy "Public read bulletins" on bulletins for select to anon, authenticated using (true);
create policy "Admin insert bulletins" on bulletins for insert to authenticated with check (is_admin());
create policy "Admin update bulletins" on bulletins for update to authenticated using (is_admin());
create policy "Admin delete bulletins" on bulletins for delete to authenticated using (is_admin());

-- Galleries
create policy "Public read galleries" on galleries for select to anon, authenticated using (true);
create policy "Admin insert galleries" on galleries for insert to authenticated with check (is_admin());
create policy "Admin update galleries" on galleries for update to authenticated using (is_admin());
create policy "Admin delete galleries" on galleries for delete to authenticated using (is_admin());

-- Gallery Images
create policy "Public read gallery_images" on gallery_images for select to anon, authenticated using (true);
create policy "Admin insert gallery_images" on gallery_images for insert to authenticated with check (is_admin());
create policy "Admin update gallery_images" on gallery_images for update to authenticated using (is_admin());
create policy "Admin delete gallery_images" on gallery_images for delete to authenticated using (is_admin());

-- Resources
create policy "Public read resources" on resources for select to anon, authenticated using (true);
create policy "Admin insert resources" on resources for insert to authenticated with check (is_admin());
create policy "Admin update resources" on resources for update to authenticated using (is_admin());
create policy "Admin delete resources" on resources for delete to authenticated using (is_admin());

-- Site Settings
create policy "Public read site_settings" on site_settings for select to anon, authenticated using (true);
create policy "Admin insert site_settings" on site_settings for insert to authenticated with check (is_admin());
create policy "Admin update site_settings" on site_settings for update to authenticated using (is_admin());

-- Hero Slides
create policy "Public read hero_slides" on hero_slides for select to anon, authenticated using (true);
create policy "Admin insert hero_slides" on hero_slides for insert to authenticated with check (is_admin());
create policy "Admin update hero_slides" on hero_slides for update to authenticated using (is_admin());
create policy "Admin delete hero_slides" on hero_slides for delete to authenticated using (is_admin());

-- ============================================
-- RLS 정책 — 신청 폼 (공개 INSERT + 관리자 SELECT/UPDATE/DELETE)
-- ============================================

-- Newcomer Forms
create policy "Anyone submit newcomer" on newcomer_forms for insert to anon, authenticated with check (true);
create policy "Admin read newcomer" on newcomer_forms for select to authenticated using (is_admin());
create policy "Admin update newcomer" on newcomer_forms for update to authenticated using (is_admin());
create policy "Admin delete newcomer" on newcomer_forms for delete to authenticated using (is_admin());

-- Prayer Requests
create policy "Anyone submit prayer" on prayer_requests for insert to anon, authenticated with check (true);
create policy "Admin read prayer" on prayer_requests for select to authenticated using (is_admin());
create policy "Admin update prayer" on prayer_requests for update to authenticated using (is_admin());
create policy "Admin delete prayer" on prayer_requests for delete to authenticated using (is_admin());

-- Visit Requests
create policy "Anyone submit visit" on visit_requests for insert to anon, authenticated with check (true);
create policy "Admin read visit" on visit_requests for select to authenticated using (is_admin());
create policy "Admin update visit" on visit_requests for update to authenticated using (is_admin());
create policy "Admin delete visit" on visit_requests for delete to authenticated using (is_admin());

-- ============================================
-- 초기 데이터 (site_settings)
-- ============================================
-- 빈 템플릿. setup-church Skill이 인터뷰 답변으로 UPSERT합니다.
insert into site_settings (key, value) values
  ('year_motto', '{"year": null, "motto": "", "scripture": "", "body": ""}'::jsonb),
  ('vision_three', '{"v1": "", "v2": "", "v3": ""}'::jsonb),
  ('month_motto', '{"month": null, "motto": ""}'::jsonb),
  ('contact', '{"address": "", "phone": "", "account": ""}'::jsonb),
  ('sns', '{"band": "", "youtube": "", "instagram": ""}'::jsonb)
on conflict (key) do nothing;
