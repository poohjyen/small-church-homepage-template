import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getSiteSetting } from "@/lib/data/site";
import {
  AdminEmailSection,
  AdminNameSection,
  ContactSection,
  DawnPrayersSection,
  OfferingAccountsSection,
  PageHeroImagesSection,
  PastorGreetingSection,
  SnsSection,
  VisionThreeSection,
  WorshipSchedulesSection,
  YearMottoSection,
} from "./SettingsForms";

export const metadata = { title: "사이트 설정" };

export default async function AdminSettingsPage() {
  const [
    yearMotto,
    visionThree,
    contact,
    sns,
    adminEmail,
    pageHeroImages,
    pastorGreeting,
    worshipSchedules,
    dawnPrayers,
    offeringAccounts,
    adminName,
  ] = await Promise.all([
    getSiteSetting("year_motto"),
    getSiteSetting("vision_three"),
    getSiteSetting("contact"),
    getSiteSetting("sns"),
    getSiteSetting("admin_email"),
    getSiteSetting("page_hero_images"),
    getSiteSetting("pastor_greeting"),
    getSiteSetting("worship_schedules"),
    getSiteSetting("dawn_prayers"),
    getSiteSetting("offering_accounts"),
    getSiteSetting("admin_name"),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="사이트 설정"
        description="홈/소개/푸터 등 사이트 전반에 노출되는 텍스트와 연락처를 관리합니다."
      />
      <AdminNameSection initial={typeof adminName === "string" ? adminName : null} />
      <PastorGreetingSection initial={pastorGreeting} />
      <YearMottoSection initial={yearMotto} />
      <VisionThreeSection initial={visionThree} />
      <WorshipSchedulesSection initial={worshipSchedules} />
      <DawnPrayersSection initial={dawnPrayers} />
      <OfferingAccountsSection initial={offeringAccounts} />
      <ContactSection initial={contact} />
      <SnsSection initial={sns} />
      <PageHeroImagesSection initial={pageHeroImages} />
      <AdminEmailSection initial={typeof adminEmail === "string" ? adminEmail : null} />
    </div>
  );
}
