-- ============================================
-- 휴지통(소프트 삭제) + 콘텐츠 임시저장(드래프트)
-- 실행 위치: Supabase Dashboard → SQL Editor → New query
--
-- 1. 15개 테이블에 deleted_at TIMESTAMPTZ NULL 컬럼 추가
-- 2. deleted_at NOT NULL 부분 인덱스 (휴지통 조회용)
-- 3. 4개 콘텐츠 테이블(bulletins/notices/schedules/pastoral_columns)에 is_draft 추가
--    (sermons는 이미 0016에서 추가됨)
-- ============================================

-- ─── deleted_at: 콘텐츠 11개 ───────────────────────────────────────
alter table public.bulletins         add column if not exists deleted_at timestamptz default null;
alter table public.notices           add column if not exists deleted_at timestamptz default null;
alter table public.schedules         add column if not exists deleted_at timestamptz default null;
alter table public.pastoral_columns  add column if not exists deleted_at timestamptz default null;
alter table public.sermons           add column if not exists deleted_at timestamptz default null;
alter table public.videos            add column if not exists deleted_at timestamptz default null;
alter table public.galleries         add column if not exists deleted_at timestamptz default null;
alter table public.gallery_images    add column if not exists deleted_at timestamptz default null;
alter table public.resources         add column if not exists deleted_at timestamptz default null;
alter table public.hero_slides       add column if not exists deleted_at timestamptz default null;
alter table public.site_popups       add column if not exists deleted_at timestamptz default null;

-- ─── deleted_at: 공개 폼 4개 ─────────────────────────────────────
alter table public.newcomer_forms    add column if not exists deleted_at timestamptz default null;
alter table public.prayer_requests   add column if not exists deleted_at timestamptz default null;
alter table public.visit_requests    add column if not exists deleted_at timestamptz default null;
alter table public.donation_receipts add column if not exists deleted_at timestamptz default null;

-- ─── 휴지통 조회용 부분 인덱스 (실제 삭제된 행만 대상) ─────────────
create index if not exists idx_bulletins_deleted_at         on public.bulletins(deleted_at)         where deleted_at is not null;
create index if not exists idx_notices_deleted_at           on public.notices(deleted_at)           where deleted_at is not null;
create index if not exists idx_schedules_deleted_at         on public.schedules(deleted_at)         where deleted_at is not null;
create index if not exists idx_pastoral_columns_deleted_at  on public.pastoral_columns(deleted_at)  where deleted_at is not null;
create index if not exists idx_sermons_deleted_at           on public.sermons(deleted_at)           where deleted_at is not null;
create index if not exists idx_videos_deleted_at            on public.videos(deleted_at)            where deleted_at is not null;
create index if not exists idx_galleries_deleted_at         on public.galleries(deleted_at)         where deleted_at is not null;
create index if not exists idx_gallery_images_deleted_at    on public.gallery_images(deleted_at)    where deleted_at is not null;
create index if not exists idx_resources_deleted_at         on public.resources(deleted_at)         where deleted_at is not null;
create index if not exists idx_hero_slides_deleted_at       on public.hero_slides(deleted_at)       where deleted_at is not null;
create index if not exists idx_site_popups_deleted_at       on public.site_popups(deleted_at)       where deleted_at is not null;
create index if not exists idx_newcomer_forms_deleted_at    on public.newcomer_forms(deleted_at)    where deleted_at is not null;
create index if not exists idx_prayer_requests_deleted_at   on public.prayer_requests(deleted_at)   where deleted_at is not null;
create index if not exists idx_visit_requests_deleted_at    on public.visit_requests(deleted_at)    where deleted_at is not null;
create index if not exists idx_donation_receipts_deleted_at on public.donation_receipts(deleted_at) where deleted_at is not null;

-- ─── is_draft: 콘텐츠 4개 (sermons는 0016에서 이미 적용) ─────────
alter table public.bulletins        add column if not exists is_draft boolean not null default false;
alter table public.notices          add column if not exists is_draft boolean not null default false;
alter table public.schedules        add column if not exists is_draft boolean not null default false;
alter table public.pastoral_columns add column if not exists is_draft boolean not null default false;
