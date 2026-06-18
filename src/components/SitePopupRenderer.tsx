// 공개 페이지 팝업 렌더러 — (public)/layout.tsx 안에 마운트해야 동작합니다.
// 예: <SitePopupRenderer /> 또는 <SitePopupRenderer path="/about" />
// (서버 컴포넌트: 활성 팝업을 직접 페치 → 클라이언트 PopupClient에 전달)
import { getActivePopupsForPath } from "@/lib/data/popups";
import { PopupClient } from "@/components/popup/PopupClient";

export async function SitePopupRenderer({ path = "/" }: { path?: string }) {
  const popups = await getActivePopupsForPath(path);
  if (popups.length === 0) return null;
  return <PopupClient popups={popups} />;
}
