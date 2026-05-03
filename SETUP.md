# SETUP — 사전 준비물 가이드

`/setup-church`를 실행하기 전에 다음을 모두 준비해주세요. 모두 무료 티어로 시작 가능합니다.

---

## 1. Claude Code 설치

[Claude Code](https://claude.ai/code)는 Anthropic의 공식 AI 코딩 어시스턴트입니다.

**Mac:**
```bash
# Homebrew가 있다면
brew install --cask claude-code

# 또는 공식 사이트에서 다운로드
# https://claude.ai/download
```

**Windows / Linux:**
- https://claude.ai/download 에서 본인 OS용 설치 파일 다운로드

설치 후 터미널에서 `claude` 명령어가 실행되는지 확인:
```bash
claude --version
```

---

## 2. GitHub 계정 + 저장소 생성

### 2-1. GitHub 가입
1. https://github.com/signup 에서 가입
2. 이메일 인증

### 2-2. 이 템플릿으로 새 저장소 만들기
1. 이 GitHub 저장소(`church-template`) 페이지 우측 상단의 **"Use this template"** 초록색 버튼 클릭
2. **"Create a new repository"** 선택
3. Repository name 입력 (예: `my-church-site`)
4. **Public** 또는 **Private** 선택 (둘 다 가능)
5. **Create repository** 클릭

### 2-3. 본인 컴퓨터로 클론
```bash
git clone https://github.com/<본인 ID>/<저장소명>.git
cd <저장소명>
```

---

## 3. Supabase 가입 + Organization 만들기

Supabase는 데이터베이스, 로그인, 파일 저장을 무료로 제공합니다.

### 3-1. 가입
1. https://supabase.com 접속
2. **"Start your project"** 클릭
3. **"Continue with GitHub"** 선택 (위에서 만든 GitHub 계정)

### 3-2. Organization 생성
- 첫 로그인 시 Organization 만들기 화면이 나옵니다.
- 이름: 본인 또는 교회 이름 (예: "Sunny Church")
- Plan: **Free** (월 $0)

> 💡 setup-church Skill이 이 Organization 안에 새 프로젝트를 자동 생성합니다. 사용자가 직접 만들 필요 없습니다.

### 3-3. (대체) 직접 만들기 — Skill이 실패할 경우 대비
Skill이 자동 생성에 실패하면 직접 만들 수 있습니다:
1. Dashboard → **New project** 버튼
2. Name: `<교회명>-church` (예: `somang-church`)
3. Database Password: 자동 생성 → **반드시 1Password 등에 저장**
4. Region: **Northeast Asia (Seoul)** — 한국 사용자 응답 속도 최적
5. Plan: **Free**

생성 후 Settings → API에서 다음 3개 값을 복사:
- Project URL (예: `https://abcd.supabase.co`)
- `anon` `public` key
- `service_role` key (secret — 절대 공개하지 말 것)

---

## 4. Vercel 가입 + GitHub 연동

Vercel은 Next.js 앱을 무료로 호스팅합니다.

### 4-1. 가입
1. https://vercel.com 접속
2. **"Start Deploying"** 클릭
3. **"Continue with GitHub"** 선택

### 4-2. GitHub 권한 부여
- "Install Vercel for GitHub" → 본인 계정 선택
- All repositories 또는 위에서 만든 저장소만 선택해도 됨

### 4-3. (선택) Vercel CLI 설치 — Skill 자동화에 권장
```bash
npm install -g vercel
vercel login   # 브라우저 인증
```

---

## 5. Resend 가입 + API Key 발급

Resend는 폼 제출 시 관리자에게 알림 메일을 보내는 서비스입니다.

### 5-1. 가입
1. https://resend.com 접속
2. **"Sign up"** → GitHub 로그인

### 5-2. API Key 발급
1. Dashboard → **API Keys** → **Create API Key**
2. Name: `church-website`
3. Permission: **Sending access**
4. 발급된 키 복사 (예: `re_abc...`) — 한 번만 보임, 잘 보관

> 💡 도메인 검증 없이 시작하면 발신 주소가 `onboarding@resend.dev`로 됩니다 (테스트용, 스팸함 분류 가능성 있음). 운영 시에는 [Domains 메뉴](https://resend.com/domains)에서 본인 도메인을 검증하세요.

---

## 6. MCP 서버 설치 (Claude Code 용)

Claude Code가 Supabase·Vercel과 직접 통신하려면 **MCP(Model Context Protocol)** 서버가 필요합니다.

### 6-1. 설정 파일 위치 확인

Claude Code의 MCP 설정 파일은:
- Mac/Linux: `~/.claude/settings.json`
- Windows: `%USERPROFILE%\.claude\settings.json`

(또는 프로젝트별 `.mcp.json` 파일도 가능)

### 6-2. Supabase MCP 추가

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<여기에 본인 토큰 입력>"
      }
    }
  }
}
```

**SUPABASE_ACCESS_TOKEN 발급:**
- https://supabase.com/dashboard/account/tokens
- "Generate new token" → 이름: `claude-mcp` → 토큰 복사

### 6-3. Vercel MCP

Vercel MCP는 [공식 플러그인](https://vercel.com/docs/cli/integration)으로 제공됩니다. Claude Code 메뉴에서:
- `/plugin install vercel`

또는 https://github.com/vercel/mcp 참조.

### 6-4. 설치 확인

Claude Code 재시작 후:
```
/mcp
```

명령으로 supabase, vercel이 응답하는지 확인.

---

## 7. 모두 준비되었다면

이제 본격적으로 시작합니다:

```bash
cd <저장소명>
claude
```

```
/setup-church
```

🎉 약 30분 후 본인 교회 홈페이지가 https://...vercel.app 에 배포됩니다!

---

## ⚠️ 자주 묻는 질문

**Q: 무료 티어로 충분한가요?**
A: 네. Supabase Free(500MB DB, 1GB Storage), Vercel Hobby(100GB 대역폭/월), Resend Free(월 3000건)는 일반 교회 1개에 충분합니다.

**Q: 도메인 (예: `mychurch.kr`)을 연결할 수 있나요?**
A: 네. Vercel Dashboard → Domains에서 추가 후 DNS 설정만 하면 됩니다. (Vercel 무료 티어도 가능)

**Q: 디자인을 바꾸고 싶어요.**
A: 색상은 `src/app/globals.css`의 CSS 변수, 레이아웃은 `src/components/sections/*`에서 수정할 수 있습니다. 또는 admin에서 색상·로고만 바꾸는 정도는 인터뷰 단계에서 처리됩니다.

**Q: 다른 교회의 정보로 다시 시작하려면?**
A: 새 GitHub 저장소를 만들고 같은 과정을 반복하세요. 기존 저장소를 재사용하려면 `.church-setup.json`을 삭제하고 `/setup-church`를 다시 실행.

**Q: 문제가 생겼어요.**
A: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 참조 또는 GitHub Issues에 문의.
