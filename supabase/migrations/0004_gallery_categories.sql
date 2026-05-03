-- 0004_gallery_categories.sql
-- 갤러리 카테고리 통합: 기존 6종 → 3종(예배 / 특별행사 / 교회학교)
-- 헌신예배·기관행사·기념일·기타 데이터를 모두 '특별행사'로 통합한다.
update public.galleries
   set category = '특별행사'
 where category in ('헌신예배', '기관행사', '기념일', '기타');
