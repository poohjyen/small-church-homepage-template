<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 에이전트(Claude Code)를 위한 프로젝트 가이드

## 이 프로젝트는 무엇인가
한국 교회용 홈페이지 템플릿. 비기술자가 `/setup-church` Skill로 인터뷰만 답하면 30분 안에 Vercel에 배포되도록 설계됨.

## 단일 진실의 소스 (Single Source of Truth)
- `church.config.ts` — 빌드 타임 상수 (이름, 색상, 폰트, SEO). 직접 수정 가능
- Supabase `site_settings` 테이블 — 런타임 가변 데이터 (표어, 비전, 연락처, 계좌, SNS, 예배 일정)
- `.env.local` — 인스턴스 식별 (Supabase URL/keys, Resend, NEXT_PUBLIC_SITE_URL)

## setup-church Skill
- 위치: `.claude/skills/setup-church/SKILL.md`
- 핵심 스크립트:
  - `scripts/apply-config.mjs` — `.church-setup.json` → 코드 패치
  - `scripts/generate-placeholders.mjs` — SVG 로고/슬라이드 자동 생성
  - `scripts/build-seed-sql.mjs` — site_settings UPSERT SQL 생성

## 코드 변경 시 주의사항
- 하드코딩된 교회명·연락처는 절대 추가 금지. 항상 `CHURCH` 객체나 `site_settings`에서 가져올 것
- 브랜드 색상은 `globals.css`의 CSS 변수 6개를 통해서만 사용 (`bg-primary-navy` 등)
- 새 섹션을 추가할 때는 `LANDING_SECTION_KEYS`(src/lib/landing-sections.ts)에 키를 등록해 admin에서 on/off 제어 가능하게
- 빈 데이터(예: 공지 0건, 슬라이드 0개) 시 더미가 아닌 빈 상태 UI("아직 등록된 콘텐츠가 없습니다") 표시. 신규 교회에 다른 교회 더미 데이터가 보이면 안 됨.

## RLS 정책
모든 콘텐츠 테이블의 INSERT/UPDATE/DELETE는 `is_admin()` 체크. `is_admin()`은 `admin_users` 테이블 조회로 동작.

## 새 마이그레이션
`supabase/migrations/0009_*.sql` 식으로 추가. 0001~0008은 setup-church가 실행하므로 절대 수정 금지(새 사용자가 처음부터 적용함).
