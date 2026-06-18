-- Phase 19.1에서 코드는 정리됐으나 0001_init.sql seed에 남아있던
-- month_motto site_settings row 제거. idempotent.
delete from site_settings where key = 'month_motto';
