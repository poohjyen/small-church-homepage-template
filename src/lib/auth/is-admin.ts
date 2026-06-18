import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// 현재 요청자가 관리자인지 판별. 공개 페이지(편집 버튼 노출)에서 사용.
// React cache 로 요청당 1회만 실제 검사 → layout/page 중복 호출해도 비용 1회.
// 비로그인 방문자는 세션 쿠키가 없어 즉시 false 반환(네트워크 호출 없음).
export const getIsAdmin = cache(async (): Promise<boolean> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.rpc("is_admin");
    return data === true;
  } catch {
    return false;
  }
});
