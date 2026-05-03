import { PageHero } from "@/components/layout/PageHero";
import { getSiteSetting } from "@/lib/data/site";
import { CHURCH } from "../../../../church.config";

export const metadata = { title: "개인정보 처리방침" };

const buildSections = (
  churchName: string,
  adminName: string,
  contactPhone: string,
  contactEmail: string,
): { heading: string; body: string[] }[] => [
  {
    heading: "1. 수집하는 개인정보 항목",
    body: [
      `${churchName}(이하 '교회')는 새가족 등록·심방 요청·기도 제목 신청·헌금 안내 등의 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.`,
      "필수 항목: 성명, 연락처(휴대전화), 거주 지역",
      "선택 항목: 이메일, 생년월일, 가족 관계, 신앙 이력, 기도 제목·심방 요청 내용",
      "자동 수집 항목: 접속 IP, 쿠키, 접속 기록, 기기 정보(서비스 이용 통계·보안 목적)",
    ],
  },
  {
    heading: "2. 개인정보 수집 및 이용 목적",
    body: [
      "교회의 새가족 환영 안내 및 양육 과정 연결",
      "심방 요청·기도 제목·문자 안내 등 목양적 돌봄",
      "예배·교육 프로그램 안내 및 행사 알림",
      "헌금 입금 확인 및 영수증 발급",
      "민원 처리, 분쟁 조정 및 법적 의무 이행",
    ],
  },
  {
    heading: "3. 보유 및 이용 기간",
    body: [
      "수집된 개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다.",
      "다만, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 안전하게 보관합니다.",
      "헌금 영수증 관련 자료: 5년 (소득세법)",
      "민원 처리 관련 기록: 3년 (전자상거래법)",
      "그 외 정성적 자료(새가족 카드 등)는 본인의 삭제 요청 시 즉시 파기합니다.",
    ],
  },
  {
    heading: "4. 개인정보의 제3자 제공",
    body: [
      "교회는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.",
      "현재 정기적으로 제3자에게 제공하는 개인정보는 없습니다.",
    ],
  },
  {
    heading: "5. 개인정보 처리위탁",
    body: [
      "교회는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁할 수 있습니다.",
      "수탁자: Vercel Inc.(웹 호스팅), Supabase Inc.(데이터 저장), Resend Inc.(이메일 발송)",
      "위탁 업무: 웹사이트 운영·문의 메일 발송·데이터 백업",
      "수탁자에 대해서는 「개인정보 보호법」 제26조에 따라 위탁계약 시 개인정보의 안전한 관리를 위해 필요한 사항을 규정하고 감독합니다.",
    ],
  },
  {
    heading: "6. 정보주체의 권리·의무 및 행사 방법",
    body: [
      "정보주체는 교회에 대해 언제든지 다음과 같은 권리를 행사할 수 있습니다.",
      "개인정보 열람 요구",
      "오류 등이 있을 경우 정정 요구",
      "삭제 요구",
      "처리 정지 요구",
      "권리 행사는 아래 개인정보 보호책임자에게 서면, 전화, 이메일을 통해 요청하실 수 있으며, 교회는 이에 대해 지체 없이 조치합니다.",
    ],
  },
  {
    heading: "7. 개인정보의 파기 절차 및 방법",
    body: [
      "교회는 개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 해당 정보를 파기합니다.",
      "전자적 파일 형태의 정보는 복구가 불가능한 방법으로 영구 삭제하며, 종이 문서는 분쇄하거나 소각하여 파기합니다.",
    ],
  },
  {
    heading: "8. 개인정보의 안전성 확보 조치",
    body: [
      "교회는 「개인정보 보호법」 제29조에 따라 다음과 같은 안전성 확보 조치를 취하고 있습니다.",
      "관리적 조치: 내부관리계획 수립·시행, 정기 교육",
      "기술적 조치: 접근 권한 관리, 암호화, 보안 프로그램 설치",
      "물리적 조치: 자료 보관실 등의 접근 통제",
    ],
  },
  {
    heading: "9. 개인정보 보호책임자",
    body: [
      "교회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해 구제 등을 위해 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.",
      `개인정보 보호책임자: ${adminName} ${CHURCH.pastorTitle}`,
      `연락처: ${contactPhone || "—"} / ${contactEmail || "—"}`,
      "정보주체는 교회의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의·불만 처리·피해 구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.",
    ],
  },
  {
    heading: "10. 권익 침해 구제 방법",
    body: [
      "정보주체는 개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁 해결이나 상담 등을 신청할 수 있습니다.",
      "개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)",
      "개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)",
      "대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)",
      "경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)",
    ],
  },
  {
    heading: "11. 시행일자 및 개정",
    body: [
      "본 방침은 2026년 5월 1일부터 시행됩니다.",
      "본 방침의 내용 추가, 삭제 및 수정이 있을 시에는 시행 7일 전부터 홈페이지의 공지사항을 통해 고지할 것입니다.",
    ],
  },
];

export default async function PrivacyPage() {
  const [adminNameSetting, contact] = await Promise.all([
    getSiteSetting("admin_name"),
    getSiteSetting("contact"),
  ]);
  const adminName =
    (typeof adminNameSetting === "string" && adminNameSetting.trim()) ||
    CHURCH.pastorName.replace(/\s*목사\s*$/, "");
  const phone = contact?.phone?.trim() || "";
  const email = ""; // 향후 contact에 email 필드 추가 시 사용
  const sections = buildSections(CHURCH.name, adminName, phone, email);
  return (
    <>
      <PageHero eyebrow="PRIVACY" title="개인정보 처리방침" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-lg font-bold text-primary-navy md:text-xl">
                {s.heading}
              </h2>
              <div className="mt-4 space-y-3 text-warm-gray">
                {s.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>
          ))}
          <p className="border-t border-slate-200 pt-6 text-sm text-warm-gray">
            공고일자: 2026년 4월 20일 · 시행일자: 2026년 5월 1일
          </p>
        </div>
      </div>
    </>
  );
}
