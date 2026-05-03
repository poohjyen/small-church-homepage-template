import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// service_role 키 사용 — RLS를 우회합니다.
// 절대 클라이언트 컴포넌트나 브라우저로 노출하지 마세요. Route Handler / Server Action 전용.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
