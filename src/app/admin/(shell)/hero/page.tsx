import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getHeroSlides } from "@/lib/data/site";
import { HeroSlideForm } from "./HeroSlideForm";
import { HeroSlidesList } from "./HeroSlidesList";

export const metadata = { title: "히어로 슬라이드" };

export default async function AdminHeroPage() {
  const slides = await getHeroSlides();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="히어로 슬라이드"
        description="랜딩페이지 상단 배너의 이미지·문구를 관리합니다. 활성화된 슬라이드만 노출됩니다."
      />

      <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        <h2 className="mb-4 text-base font-semibold text-charcoal">
          새 슬라이드 추가
        </h2>
        <HeroSlideForm />
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold text-charcoal">
          등록된 슬라이드 ({slides.length}개)
        </h2>
        <HeroSlidesList slides={slides} />
      </section>
    </div>
  );
}
