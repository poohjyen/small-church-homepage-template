-- 0011: (의도적 no-op)
--
-- 원본(dream-church)에서는 교회일정을 notices(category='schedule')에서
-- 별도 schedules 테이블로 분리했지만, 이 템플릿은 교회일정을
-- notices 테이블의 category='schedule' 로 그대로 운영합니다(더 단순, 동일 결과).
-- 따라서 notices.category 컬럼을 DROP 하던 원본 0011은 이 템플릿에 적용하지 않습니다.
-- 번호 연속성을 위해 파일만 유지하는 의도적 빈 마이그레이션입니다.

select 1;
