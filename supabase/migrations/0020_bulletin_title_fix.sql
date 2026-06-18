-- 기존 주보 제목 표기 통일: "…주일주보" / "…주일 주보" → "…주보"
-- (목록이 제목 한 줄만 표시하도록 변경됨에 따라 옛 글 제목도 새 형식으로 정리)
update public.bulletins
  set title = replace(replace(title, '주일 주보', '주보'), '주일주보', '주보')
  where title like '%주일%주보%';
