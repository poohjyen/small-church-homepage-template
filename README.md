# 교회 홈페이지 템플릿

Next.js + Supabase + Vercel 기반의 한국 교회용 홈페이지 템플릿. **Claude Code 한 번의 명령(`/setup-church`)으로 인터뷰부터 배포까지 30분만에 완료**합니다.

> 🏛️ 비기술자(목사·사무장)가 한국어 대화만으로 교회 홈페이지를 만들 수 있도록 설계되었습니다.

---

## ✨ 무엇을 얻나요?

- **메인 페이지** (9개 섹션 — 환영/비전/예배시간/이번주 설교영상/콘텐츠 4분할/빠른신청/갤러리/온라인헌금/오시는길)
- **교회안내** (인사말/예배안내/오시는 길/교회비전)
- **예배와 말씀** (주일설교/목양칼럼/특별영상)
- **교회소식** (공지/주보/행사일정), **갤러리**, **자료실**, **선교 소개**
- **온라인 신청 폼** (새가족 등록/기도제목/심방 요청/기부금영수증) + 자동 메일 알림
- **관리자 페이지** — 모든 콘텐츠 관리 + 사이트 설정 + 팝업·배너 + 휴지통/임시저장 + 방문자 통계
- **선택 자동화** (키 등록 시) — 유튜브 설교 자동 동기화 · AI 주보 자동 분석(Gemini) · 캡차 · 에러 모니터링
- 모바일 반응형 · 사진 패럴럭스 · 부드러운 등장 효과 · RSS 피드 · SEO 메타데이터

---

## 🚀 시작하기 (3단계)

### 1. 사전 준비물

**① 도구 1개 — Claude Code (필수)**

설정 인터뷰(`/setup-church`)가 여기서 돌아갑니다. 없으면 먼저 설치하세요 → [claude.ai/code](https://claude.ai/code)

**② 계정 4개 — 모두 무료로 시작 (신용카드 불필요)**

| 서비스 | 용도 | 가입 |
|---|---|---|
| **GitHub** | 코드 저장소 + 배포 연동 | https://github.com/signup |
| **Supabase** | 데이터베이스 + 로그인 + 파일 저장 | https://supabase.com (GitHub 로그인) |
| **Vercel** | 홈페이지 호스팅/배포 | https://vercel.com (GitHub 로그인) |
| **Resend** | 폼 신청 시 알림 메일 발송 | https://resend.com (GitHub 로그인) |

> 💡 Supabase·Vercel·Resend는 **GitHub 계정으로 바로 로그인**할 수 있어, 사실상 GitHub 하나면 시작됩니다. 모두 무료 요금제로 운영 가능합니다.

**③ 선택 — 나중에 필요할 때만 (없어도 자동으로 꺼짐)**

아래 기능은 각 키를 등록하면 켜지고, 등록 전에는 조용히 비활성됩니다. 처음엔 신경 쓰지 않아도 됩니다.

| 기능 | 필요한 키 |
|---|---|
| 유튜브 설교 자동 동기화 | YouTube Data API 키 |
| AI 주보 자동 분석 | Google AI Studio(Gemini) 키 — 무료 티어 |
| 스팸 방지 캡차 | Cloudflare Turnstile 키 |
| 에러 모니터링 | Sentry DSN |

선택 키 목록은 [`.env.local.example`](./.env.local.example), 단계별 가입 가이드는 [SETUP.md](./SETUP.md) 참조.

### 2. 이 템플릿으로 새 저장소 만들기

GitHub에서 이 페이지 우측 상단의 **"Use this template"** → **"Create a new repository"** 버튼을 클릭하세요.

만들어진 본인의 저장소를 로컬에 클론합니다:

```bash
git clone https://github.com/<본인>/<저장소명>.git
cd <저장소명>
```

### 3. Claude Code로 설정

[Claude Code](https://claude.ai/code) (Anthropic의 AI 코딩 도구)를 설치하지 않았다면 먼저 설치하세요. 이미 있다면:

```bash
claude
```

Claude Code가 시작되면 다음 명령을 입력:

```
/setup-church
```

이제 한국어로 8개 카테고리 인터뷰가 시작됩니다 (약 10~15분):

1. 기본 정보 (교회명, 교단, 관리자 이메일)
2. 담임목사 정보
3. 표어와 비전
4. 예배 일정
5. 색상과 폰트
6. 노출할 섹션 선택
7. 연락처/계좌/SNS
8. 첫 공지사항 (선택)

인터뷰가 끝나면 자동으로:
- ✅ Supabase 프로젝트 생성 + DB 마이그레이션 적용
- ✅ Vercel 프로젝트 연결 + 환경변수 설정
- ✅ 코드 자동 패치 (church.config.ts, globals.css 등)
- ✅ Git 커밋 + 푸시 → Vercel 자동 배포

**완료되면 사이트 URL과 관리자 로그인 안내가 출력됩니다.**

---

## 📋 자세한 가이드

- [SETUP.md](./SETUP.md) — 가입·설치 단계별 가이드
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — 자주 발생하는 문제 해결
- [.claude/skills/setup-church/SKILL.md](./.claude/skills/setup-church/SKILL.md) — Skill 동작 원리 (개발자용)

---

## 🛠️ 직접 수정하고 싶다면

### 기술 스택
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **DB / Auth / Storage**: Supabase
- **이메일**: Resend
- **배포**: Vercel

### 로컬 개발

```bash
# 의존성 설치 (pnpm 권장)
pnpm install

# 환경변수 설정 (.env.local)
cp .env.local.example .env.local
# 위 파일을 열어서 Supabase/Resend 값을 채우세요

# 개발 서버 실행
pnpm dev   # http://localhost:3000
```

### 디렉토리 구조

```
src/
├── app/
│   ├── (public)/         # 공개 페이지 (Header/Footer 자동 포함)
│   ├── admin/            # 관리자 페이지 (로그인 게이트)
│   └── globals.css       # 색상 변수 (apply-config가 교체)
├── components/
│   ├── layout/           # Header, Footer, Navigation
│   ├── sections/         # 메인 페이지 섹션 (패럴럭스 포함)
│   ├── admin/            # 관리자 UI 부속
│   ├── board/            # 게시판 공통 (List, Pagination 등)
│   ├── ui/               # shadcn/ui
│   └── seo/              # JSON-LD 등
├── lib/
│   ├── supabase/         # Supabase 클라이언트 (server/client)
│   ├── data/             # DB 쿼리 함수
│   ├── email/            # Resend 헬퍼
│   ├── forms/            # Zod 스키마
│   └── site.ts           # CHURCH 어댑터
├── types/database.ts     # DB 타입
└── ...

church.config.ts          # 단일 진실의 소스 (인터뷰 산출물)
supabase/migrations/      # DB 스키마 (0001~0023)
.claude/skills/setup-church/  # 인터뷰 + 자동화 Skill
public/images/            # 로고, 슬라이드, 갤러리 (placeholder는 자동 생성)
```

### 주요 명령

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint
pnpm dlx shadcn@latest add <컴포넌트명>  # shadcn 컴포넌트 추가
```

### 디자인 토큰 변경

`src/app/globals.css`의 CSS 변수 6개:
- `--color-primary-navy` (메인)
- `--color-primary-navy-dark` / `--color-primary-navy-light`
- `--color-secondary-sky` (액센트)
- `--color-accent-coral` (강조)
- `--color-accent-amber` (보조)

---

## 🤝 라이선스 및 기여

이 템플릿은 자유롭게 사용·수정 가능합니다.

문제나 개선 아이디어가 있으면 GitHub Issues를 열어주세요.
