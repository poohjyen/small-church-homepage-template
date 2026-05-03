---
name: setup-church
description: 새 교회 홈페이지를 한국어 인터뷰로 30분 안에 배포까지 완료합니다. Supabase + Vercel MCP를 사용해 자동으로 DB와 배포를 설정합니다. 기술 지식 없이 사용 가능합니다. 사용 시기 — 사용자가 "/setup-church", "교회 홈페이지 만들기", "교회 사이트 시작"이라고 요청할 때.
---

# 교회 홈페이지 설정 마법사

이 Skill은 비기술자(목사·사무장)가 한국어 대화만으로 새 교회 홈페이지를 만들고 배포할 수 있게 해줍니다.

## 전체 흐름 (5단계, 약 30분)

| 단계 | 내용 | 소요 |
|---|---|---|
| 0 | 사전 점검 | 1분 |
| 1 | 한국어 인터뷰 8단계 | 10~15분 |
| 2 | MCP로 외부 리소스(Supabase·Vercel) 자동 생성 | 10분 |
| 3 | 인터뷰 답변으로 코드 자동 패치 | 1분 |
| 4 | 검증 + 사용자에게 URL 안내 | 1분 |

---

## Phase 0 — 사전 점검

작업 시작 전 다음을 한국어로 안내:

> 🏛️ **교회 홈페이지 설정을 시작합니다.**
> 약 30분 정도 걸리며, 중간에 8개 카테고리를 질문드릴 거예요.
> 잠시 후 시작합니다…

### Step 0.1 — 이미 설정된 사이트인지 확인

```pseudo
if Read("./church.config.ts") contains '"샘플교회"' is false:
  AskUserQuestion(
    question: "이미 설정된 사이트가 있는 것 같습니다. 처음부터 다시 시작할까요, 이어서 할까요?",
    options: [
      "처음부터 다시 (기존 설정 덮어쓰기)",
      "이어서 (.church-setup.json에서 복원)",
      "취소"
    ]
  )
  if 취소: exit
  if 이어서: load .church-setup.json → skip to last unanswered step
```

### Step 0.2 — MCP 가용성 확인

```pseudo
results = ListMcpResourcesTool()
required = ["supabase", "vercel"]  # 실제 prefix는 환경마다 다름

missing = []
for tool in available_tools:
  if "supabase" not in tool_names: missing.append("Supabase MCP")
  if "vercel" not in tool_names: missing.append("Vercel MCP")

if missing:
  print to user:
    "❌ 다음 MCP가 설치되어 있지 않습니다: {missing.join(', ')}"
    "SETUP.md의 'MCP 설치' 섹션을 참조해 설치 후 다시 시도해주세요."
    "설치 후 Claude Code를 재시작하셔야 합니다."
  exit
```

### Step 0.3 — Git 저장소 확인

```pseudo
if not exists(.git):
  AskUserQuestion(
    question: "이 폴더가 Git 저장소가 아닙니다. 어떻게 하시겠어요?",
    options: [
      "지금 git init 하고 진행 (Vercel 배포에 필요)",
      "취소"
    ]
  )
  if 진행: Bash("git init && git add -A")
```

---

## Phase 1 — 인터뷰 (한국어, 8단계)

각 단계 시작 전 진행률을 안내:
> **[N/8] {카테고리명}** — 약 1~2분 소요

각 단계가 끝나면 `.church-setup.json`에 누적 저장:

```pseudo
function saveProgress(step, data):
  existing = Read(".church-setup.json") or {}
  existing[step] = data
  existing.lastStep = step
  Write(".church-setup.json", JSON.stringify(existing, null, 2))
```

### Step 1/8 — 기본 정보

AskUserQuestion 4회 (또는 사용자가 자유 답변하도록 자연어 대화):

1. **교회 이름** (예: "소망교회") — text
2. **교단** (선택, 예: "대한예수교장로회 합동", 비우면 표시 안 함) — text
3. **설립연도** (예: "2010") — number
4. **관리자 이메일** (Supabase 로그인용 — 매우 중요) — email

저장:
```json
{ "basic": { "name": "...", "denomination": "...", "founded": "...", "adminEmail": "..." } }
```

### Step 2/8 — 담임목사

1. **목사님 성함** (예: "홍길동") — text
2. **직함** (선택지: "담임목사", "위임목사", "협동목사", "직접입력") — choice
3. **환영인사** (선택, 200자 정도, 비우면 admin에서 작성) — textarea

저장:
```json
{ "pastor": { "name": "...", "title": "...", "greeting": "..." } }
```

### Step 3/8 — 표어와 비전

1. **올해 표어** (예: "함께 세워가는 교회") — text
2. **본문 말씀** (예: "에베소서 4:11-13") — text
3. **본문 내용** (선택, 표어가 인용한 성경 본문) — textarea
4. **3대 비전** — text x3 (각 한 줄)

저장:
```json
{
  "vision": {
    "year": 2026,
    "motto": "...",
    "scripture": "...",
    "body": "...",
    "v1": "...", "v2": "...", "v3": "..."
  }
}
```

### Step 4/8 — 예배 일정

여러 예배를 등록 (최대 6개):

> "주일예배 시간을 알려주세요. (예: 주일1부 오전 9시 / 본당)"
> 더 등록할 예배가 있으면 계속 추가하세요. (없으면 'done')

각 항목:
- title (예: "주일1부예배")
- day (예: "주일")
- time (예: "오전 9:00")
- place (예: "본당")

저장:
```json
{
  "worship": {
    "items": [
      { "title": "...", "day": "...", "time": "...", "place": "..." },
      ...
    ]
  }
}
```

### Step 5/8 — 색상과 폰트

**색상 프리셋** (AskUserQuestion):
- 네이비+민트 (드림교회, 모던) — primary `#02567D`, secondary `#0c9fa5`, accent `#FF9084`
- 딥레드+골드 (전통적) — primary `#7A1F1F`, secondary `#C99A2E`, accent `#3B5998`
- 올리브+크림 (자연) — primary `#3D5A2E`, secondary `#A88B5C`, accent `#D4623A`
- 직접 입력 — 4개 hex 코드 후속 질문

**폰트 프리셋** (AskUserQuestion):
- GMarket Sans (현대적, 기본) — local font, 동봉됨
- Noto Serif KR (전통적, 명조 계열) — Google Fonts
- Pretendard (모던, 산세리프) — Google Fonts
- Spoqa Han Sans Neo (깔끔, 기업체 선호) — Google Fonts

저장:
```json
{
  "colors": {
    "primaryNavy": "#02567D",
    "primaryNavyDark": "#013A57",
    "primaryNavyLight": "#3A7FA0",
    "secondarySky": "#0c9fa5",
    "accentCoral": "#FF9084",
    "accentAmber": "#F5A623"
  },
  "fonts": { "heading": "gmarket-sans", "body": "noto-sans-kr" }
}
```

### Step 6/8 — 노출 섹션 (multiSelect)

8개 메인 섹션 중 표시할 것 선택:
- ✅ 환영 인사 (greeting)
- ✅ 교회 비전 카드 (vision)
- ✅ 이번 주 설교 (featured-sermon)
- ✅ 콘텐츠 4분할 (sermons-quad — 설교/칼럼/공지/주보)
- ✅ 갤러리 스트립 (gallery-strip)
- ✅ 빠른 신청 (quick-actions)
- ✅ 온라인 헌금 (online-giving)
- ✅ 오시는 길 (location)

기본 모두 체크. 끄고 싶은 것만 해제.

저장:
```json
{ "sections": ["greeting", "vision", "featured-sermon", "sermons-quad", "gallery-strip", "quick-actions", "online-giving", "location"] }
```

### Step 7/8 — 연락처 / 계좌 / SNS

1. **주소** (도로명 주소, 예: "서울 강남구 테헤란로 1") — text
2. **대표 전화** (예: "02-1234-5678") — text
3. **헌금 계좌** (1~5개, 부서별):
   - dept (예: "재정부")
   - account (예: "농협 ○○○-○○○○○○○-○○")
4. **네이버 밴드 URL** (선택) — text
5. **유튜브 URL** (선택) — text
6. **인스타그램 URL** (선택) — text

저장:
```json
{
  "contact": { "address": "...", "phone": "...", "account": "" },
  "offering": { "items": [{"dept": "재정부", "account": "..."}] },
  "sns": { "band": "...", "youtube": "...", "instagram": "..." }
}
```

### Step 8/8 — 첫 공지 (선택, 1건)

> "첫 공지사항을 미리 등록할까요? (선택 — 나중에 admin에서 추가 가능)"

- title (예: "환영합니다")
- content (간단한 본문)

저장:
```json
{ "firstNotice": { "title": "...", "content": "..." } }
```

---

### Phase 1 마무리

8단계 완료 후 사용자에게 요약 보여주기:

> ✅ 인터뷰가 끝났습니다!
> 
> **수집된 정보 요약:**
> - 교회: {name}
> - 담임목사: {pastorName} {pastorTitle}
> - 색상: {primaryColor} 외 3색
> - 활성 섹션: {sections.length}/8
> - 헌금 계좌: {offering.items.length}개
> 
> 이제 자동으로 Supabase 프로젝트와 Vercel 배포를 설정합니다 (약 10분 소요).
> 진행할까요? (예/아니오)

사용자가 "예" 답변하면 Phase 2 진행. "아니오"면 종료 (`.church-setup.json` 보존).

---

## Phase 2 — MCP 자동화 (Supabase + Vercel)

⚠️ **중요**: 실제 MCP 메서드명은 환경에 따라 다릅니다. `ListMcpResourcesTool` 결과를 먼저 확인해 정확한 함수명을 사용하세요. 아래는 일반적인 패턴.

### Phase 2-A — Supabase 프로젝트 생성/연결

AskUserQuestion:
> "Supabase 프로젝트를 어떻게 준비할까요?"
> - 새로 만들기 (자동, 추천)
> - 기존 프로젝트 ID 직접 입력

**새로 만들기 선택 시:**
```pseudo
project_name = slugify(basic.name) + "-church"  # 예: "somang-church"
result = mcp__supabase__create_project({
  name: project_name,
  region: "ap-northeast-2",  # 서울
  organization_id: ?  # 사용자 organization 미리 조회 필요
})
# 결과: project_ref, urls, anon_key, service_role_key
saveProgress("supabase", {
  projectRef: result.project_ref,
  url: result.urls.api,
  anonKey: result.anon_key,
  serviceRoleKey: result.service_role_key
})

# DB 준비 대기 (60~120초)
print "Supabase 프로젝트 생성 중... (1~2분 소요, 잠시만요)"
wait_until_ready(result.project_ref)
```

**기존 ID 입력 시:**
사용자에게 `https://supabase.com/dashboard` → Settings → API에서:
- Project URL
- anon public key
- service_role key (secret)

세 값을 받아 `.church-setup.json`에 저장.

### Phase 2-B — 마이그레이션 적용

```pseudo
migrations = [
  "0001_init.sql",
  "0002_storage.sql",
  "0003_videos.sql",
  "0004_gallery_categories.sql",
  "0006_notices_category.sql",
  "0007_page_blocks.sql",
  "0008_page_blocks_quote_youtube.sql"
]
for m in migrations:
  sql = Read(`supabase/migrations/${m}`)
  mcp__supabase__apply_migration({ name: m, query: sql })
  print "✓ {m} 적용 완료"
```

### Phase 2-C — Storage 버킷 5개 생성

```pseudo
for bucket in ["bulletins", "gallery", "resources", "hero", "site"]:
  try:
    mcp__supabase__create_bucket({ name: bucket, public: true })
  except already_exists:
    pass  # 0002_storage.sql이 이미 만들었을 수 있음
```

### Phase 2-D — admin_users + site_settings 시드

```pseudo
mcp__supabase__execute_sql({
  query: `
    insert into admin_users (email, display_name)
    values ('${basic.adminEmail}', '${basic.adminName || basic.name + " 관리자"}')
    on conflict (email) do nothing;
  `
})
```

site_settings UPSERT — Phase 3에서 build-seed-sql.mjs로 만든 SQL 실행.

### Phase 2-E — Vercel 프로젝트 연결

```pseudo
# 사전: 사용자가 GitHub repo 푸시 완료 가정
# 1) 인증 (필요 시)
mcp__plugin_vercel_vercel__authenticate()

# 2) GitHub repo URL 입력 받기
AskUserQuestion: "Git 저장소 URL을 알려주세요 (예: https://github.com/<user>/<repo>)"
repo = answer

# 3) 프로젝트 link 또는 생성
# Vercel CLI를 통한 자동화가 가장 안정적
Bash("vercel link --yes --project " + project_name)
```

### Phase 2-F — 환경변수 5개 설정

```pseudo
env_vars = {
  "NEXT_PUBLIC_SUPABASE_URL": supabase.url,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": supabase.anonKey,
  "SUPABASE_SERVICE_ROLE_KEY": supabase.serviceRoleKey,
  "NEXT_PUBLIC_SITE_URL": "https://" + project_name + ".vercel.app",  # 첫 deploy 후 갱신
  "RESEND_API_KEY": null  # 사용자가 직접 입력 필요
}

# Resend API key 받기
AskUserQuestion:
  "이메일 발송을 위해 Resend API key가 필요합니다."
  "https://resend.com/api-keys 에서 'Create API Key' 버튼 → 발급한 키를 알려주세요."
  "(없으면 'skip' — 폼 알림 메일이 안 가지만 사이트는 동작합니다)"

if not skip: env_vars["RESEND_API_KEY"] = answer

for key, value in env_vars:
  if value:
    Bash(`vercel env add ${key} production`)
    # 또는 mcp__plugin_vercel_vercel__set_env_var
```

### Phase 2-G — 첫 배포

```pseudo
Bash("vercel deploy --prod --yes")
# 결과에서 deployment URL 추출
# 5~10분 빌드 대기
```

### Phase 2 폴백 표

| 실패 | 자동 처리 | 매뉴얼 안내 |
|---|---|---|
| Supabase 프로젝트 이름 중복 | 1회 재시도 (-2 suffix) | "Dashboard에서 직접 만든 후 ID를 알려주세요" |
| 마이그레이션 SQL 오류 | 그 마이그만 재시도 | SQL 본문 + Dashboard SQL Editor URL 안내 |
| 버킷 이름 중복 | 무시하고 진행 | — |
| Vercel 미인증 | `/vercel:authenticate` 안내 | — |
| env 설정 실패 | 1회 재시도 | "Vercel Dashboard → Settings → Environment Variables에서 직접 추가하세요" |
| 빌드 실패 | 빌드 로그 출력 | TROUBLESHOOTING.md 링크 |

---

## Phase 3 — 코드 패치

```pseudo
Bash("node .claude/skills/setup-church/scripts/apply-config.mjs")
```

`apply-config.mjs`가 `.church-setup.json`을 읽어 다음을 수행:
1. `church.config.ts` 생성
2. `src/app/globals.css` 색상 변수 4개 교체
3. `src/app/layout.tsx` 폰트 import 변경 (선택한 폰트가 GMarket Sans 외이면)
4. `package.json` name 필드 교체
5. `.env.local` 생성
6. SVG placeholder 7개 재생성 (`generate-placeholders.mjs` 호출)
7. `supabase/seed/site_settings.generated.sql` 생성

생성된 seed SQL을 Supabase에 적용:
```pseudo
sql = Read("supabase/seed/site_settings.generated.sql")
mcp__supabase__execute_sql({ query: sql })
```

첫 공지 INSERT (선택):
```pseudo
if firstNotice:
  mcp__supabase__execute_sql({
    query: `insert into notices (title, content, category, is_pinned)
            values ('${esc(firstNotice.title)}', '${esc(firstNotice.content)}', 'news', true)`
  })
```

Git 커밋 + 푸시:
```pseudo
Bash("git add -A && git commit -m 'Initial church setup: " + basic.name + "'")
Bash("git push origin main")
# Vercel이 자동으로 재배포
```

---

## Phase 4 — 검증 + 안내

```pseudo
deploymentUrl = "https://" + project_name + ".vercel.app"

# 200 응답 확인
result = WebFetch(deploymentUrl)
if not 200:
  print "⚠️ 사이트 응답이 200이 아닙니다. Vercel Dashboard 빌드 로그를 확인해주세요."

# 마지막 안내
print:
  ✅ 완료! 다음 주소로 접속하세요:
  
  📍 사이트: ${deploymentUrl}
  🔐 관리자: ${deploymentUrl}/admin/login
  
  관리자 로그인 안내:
  1. ${basic.adminEmail} 이메일로 비밀번호 설정 메일이 곧 도착합니다 (Supabase에서)
  2. 비밀번호 설정 후 위 admin 주소로 로그인
  3. /admin/hero 에서 메인 슬라이드 이미지 업로드
  4. /admin/settings 에서 담임목사 사진, 인사말 작성
  
  추가 작업 (선택):
  - 도메인 연결: Vercel Dashboard → Domains
  - Resend 도메인 검증: https://resend.com/domains
  - Google Search Console / Naver Search Advisor 등록
  
  궁금한 점은 TROUBLESHOOTING.md 또는 README.md를 참조해주세요.
```

---

## 진행 중 사용자 질문 처리

사용자가 인터뷰 중 다음과 같은 질문을 하면 친절히 답하고 그 단계로 돌아가기:
- "지금까지 답한 거 보여줘" → `.church-setup.json` 내용 출력
- "X단계로 돌아가서 수정하고 싶어" → 그 단계만 다시 진행 후 이어서
- "취소할게" → "다음에 다시 시작하시려면 '/setup-church'를 입력하세요. 답변은 .church-setup.json에 저장됩니다."

## 안전장치

- 모든 외부 호출 전 사용자에게 한 번 더 확인
- Supabase 프로젝트 비밀번호는 즉시 1Password 등에 저장하라고 안내
- service_role key는 절대 프론트엔드에 노출되지 않게 환경변수로만
- `.env.local`은 `.gitignore`에 포함되어 있는지 확인 (apply-config가 체크)
