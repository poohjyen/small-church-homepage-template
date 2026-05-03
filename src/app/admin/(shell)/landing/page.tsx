import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSiteSetting } from "@/lib/data/site";
import { normalizeLandingSections } from "@/lib/landing-sections";
import { LandingSectionsForm } from "./LandingSectionsForm";

export const metadata = { title: "랜딩 섹션 순서" };

export default async function AdminLandingPage() {
  const stored = await getSiteSetting("landing_sections");
  const initial = normalizeLandingSections(stored);

  return (
    <div className="mx-auto max-w-2xl">
      <AdminPageHeader
        title="랜딩 섹션 순서·표시"
        description="랜딩 페이지에 노출되는 섹션의 순서를 바꾸거나 일부 섹션을 임시로 숨길 수 있습니다. 히어로(슬라이드)는 항상 최상단에 고정됩니다. 저장 즉시 사이트에 반영됩니다."
      />
      <LandingSectionsForm initial={initial} />
    </div>
  );
}
