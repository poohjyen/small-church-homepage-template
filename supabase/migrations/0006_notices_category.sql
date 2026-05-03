-- 0006: notices 테이블에 category 컬럼 추가
-- 'news' = 교회소식 (기존 공지사항 데이터의 기본값)
-- 'schedule' = 교회일정

alter table notices add column if not exists category text not null default 'news';
create index if not exists idx_notices_category on notices(category);

comment on column notices.category is '게시판 분류: news(교회소식) | schedule(교회일정)';
