# TROUBLESHOOTING — 문제 해결 가이드

`/setup-church` 진행 중 또는 운영 중 자주 발생할 수 있는 문제와 해결 방법.

---

## Phase 0 — 사전 점검

### "MCP가 설치되어 있지 않습니다"
- [SETUP.md § 6](./SETUP.md#6-mcp-서버-설치-claude-code-용) 참조
- MCP 추가 후 Claude Code 재시작 필수

### "Git 저장소가 아닙니다"
```bash
git init
git remote add origin https://github.com/<본인>/<저장소>.git
git add -A
git commit -m "initial"
git push -u origin main
```

---

## Phase 1 — 인터뷰

### "이전 답변으로 돌아가서 수정하고 싶어요"
인터뷰 중 채팅으로 "X단계로 돌아가서 수정하고 싶어요"라고 말씀하세요. Skill이 해당 단계만 다시 진행합니다.

### 인터뷰가 중단됐어요
답변은 `.church-setup.json`에 저장됩니다. 다시 `/setup-church` 실행하면 "이어서 하시겠습니까?"가 뜹니다.

### 처음부터 다시 시작
```bash
rm .church-setup.json
```
후 `/setup-church` 실행.

---

## Phase 2 — Supabase

### "프로젝트 이름이 이미 존재합니다"
- Skill이 자동으로 `-2`를 붙여 재시도합니다.
- 그래도 실패하면 Dashboard에서 직접 만들고 ID를 입력하세요.

### "마이그레이션 SQL 오류"
- 오류 메시지에서 어느 마이그레이션이 실패했는지 확인 (예: `0007_page_blocks.sql`)
- 해당 SQL 파일 본문을 복사해 [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard/project/_/sql)에서 직접 실행
- 재실행 후 `/setup-church`로 이어서 진행

### "Database password가 기억이 안나요"
- Supabase Dashboard → Project Settings → Database → "Reset database password"
- ⚠️ 이 작업은 기존 연결을 끊을 수 있습니다.

### Supabase 무료 티어 한도
- 500MB Database, 1GB Storage, 50,000 monthly active users
- 7일간 비활성 시 자동 일시정지 (Dashboard에서 1클릭으로 재개)

---

## Phase 2 — Vercel

### "Vercel 인증이 안 돼요"
```bash
vercel logout
vercel login
```
브라우저가 열려서 GitHub 로그인 → Vercel 권한 부여.

### "Project name이 이미 있어요"
- Vercel 프로젝트 이름은 계정 내에서 unique
- Skill이 자동으로 `-2` 등 suffix를 붙여 재시도
- 또는 Dashboard에서 기존 프로젝트 삭제 후 재시도

### "환경변수 설정이 실패했어요"
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 다음 5개 직접 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (값: `https://<프로젝트>.vercel.app`)
3. 모두 **Production / Preview / Development** 모두 체크
4. **Save** 후 **Deployments → Redeploy** 클릭

### "Vercel 빌드가 실패합니다"
1. Vercel Dashboard → Deployments → 실패한 빌드 클릭 → Build Logs 확인
2. 흔한 원인:
   - `NEXT_PUBLIC_SUPABASE_URL` 누락 → 환경변수 추가
   - TypeScript 오류 → 로컬에서 `pnpm build`로 재현 후 수정
   - `module not found` → `pnpm install` 후 재푸시

---

## Phase 2 — Resend

### "API key가 안 받아져요"
- 키는 발급 시 한 번만 보입니다. 잊었다면 새로 발급.
- 키 형식: `re_` 시작

### "메일이 도착하지 않아요"
- 스팸함 확인 (특히 onboarding@resend.dev 발신 시)
- Resend Dashboard → Logs에서 발송 기록 확인
- 도메인 검증 (https://resend.com/domains) 후 본인 도메인 발신 권장

### "RESEND_TO 이메일이 안 잡혀요"
- Vercel 환경변수 `RESEND_TO=<관리자 이메일>` 추가
- 또는 Supabase `admin_users` 테이블의 첫 row가 fallback

---

## Phase 3 — 코드 패치

### "apply-config.mjs 실행 실패"
```bash
node .claude/skills/setup-church/scripts/apply-config.mjs
```
직접 실행해서 어디서 실패하는지 확인. `.church-setup.json` 형식 오류 가능성.

### "원래대로 되돌리고 싶어요"
모든 수정 파일은 `<file>.bak`로 백업되어 있습니다:
```bash
mv church.config.ts.bak church.config.ts
mv src/app/globals.css.bak src/app/globals.css
mv package.json.bak package.json
```

### "Git 푸시가 거부됩니다"
- GitHub 저장소가 protected branch이거나 권한이 없을 수 있음
- 본인이 만든 저장소인지 확인
- SSH key 또는 personal access token 설정 필요할 수 있음

---

## Phase 4 — 검증

### "사이트가 200을 반환하지 않아요"
1. Vercel Dashboard → Deployments → 최신 빌드 status 확인
2. "Ready" 상태가 아니면 빌드 로그 확인
3. "Ready"인데 사이트 접속 시 오류 → Function Logs 확인 (Supabase 연결 문제일 가능성)

### "관리자 로그인 메일이 안 와요"
1. Supabase Dashboard → Authentication → Users
2. 본인 이메일이 등록되어 있는지 확인 (없으면 "Add user" → invite by email)
3. 이메일 도착 후 비밀번호 설정 → /admin/login에서 로그인

### "로그인했는데 admin 권한이 없습니다 (insert/update가 안 돼요)"
- `admin_users` 테이블에 본인 이메일이 등록되어 있어야 함
- Supabase Dashboard → SQL Editor에서:
  ```sql
  insert into admin_users (email, display_name) values ('본인이메일@example.com', '본인이름');
  ```

### "메인 페이지에 빈 섹션만 보여요"
- 정상입니다. /admin에서 콘텐츠를 추가해주세요:
  - /admin/hero — 메인 슬라이드 이미지 업로드
  - /admin/sermons — 첫 설교 등록
  - /admin/notices — 공지 등록
  - /admin/settings — 인사말/표어/계좌 등 입력

---

## 운영 중 자주 묻는 질문

### "도메인을 연결하고 싶어요"
1. Vercel Dashboard → 프로젝트 → Domains → Add
2. 도메인명 입력 → DNS 레코드 안내 따르기
3. Vercel `NEXT_PUBLIC_SITE_URL` 환경변수도 갱신
4. Supabase Auth → URL Configuration → Site URL 갱신

### "관리자를 추가하고 싶어요"
Supabase Dashboard → SQL Editor:
```sql
insert into admin_users (email, display_name)
values ('새관리자@example.com', '새관리자');
```
그리고 Authentication → Users에서 invite by email로 사용자 생성.

### "비밀번호 변경"
Supabase Dashboard → Authentication → Users → 본인 → "Send password recovery email"

### "교회명·색상을 바꾸고 싶어요"
1. `church.config.ts` 직접 수정
2. `pnpm build`로 로컬 검증
3. `git push`로 자동 재배포

### "백업이 필요해요"
Supabase Dashboard → Database → Backups
- Free 플랜: 7일 daily 백업 자동
- Pro 플랜 ($25/월): 매시간 백업 + PITR

---

## 그래도 안 되면

GitHub Issues에 다음 정보와 함께 등록:
- 어느 Phase에서 발생한 문제인가
- 오류 메시지 전문 (개인정보·키 마스킹)
- `.church-setup.json` 내용 (이메일·비밀번호 마스킹)
- Vercel Build Logs (해당하는 경우)
