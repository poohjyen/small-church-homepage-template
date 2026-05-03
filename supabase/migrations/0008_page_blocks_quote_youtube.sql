-- 0008: page_blocks에 quote(인용)/youtube(동영상) 블록 추가
-- - youtube_id 컬럼 신설 (YouTube 영상 ID 11자)
-- - type CHECK 제약을 새 type 5종으로 갱신

alter table page_blocks
  add column if not exists youtube_id text;

alter table page_blocks
  drop constraint if exists page_blocks_type_check;

alter table page_blocks
  add constraint page_blocks_type_check
  check (type in ('heading','paragraph','image','quote','youtube'));

comment on column page_blocks.youtube_id is 'type=youtube일 때 사용하는 YouTube 영상 ID(11자)';
