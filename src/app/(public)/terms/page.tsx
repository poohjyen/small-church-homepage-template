import { PageHero } from "@/components/layout/PageHero";
import { CHURCH } from "../../../../church.config";

export const metadata = { title: "이용약관" };

const buildArticles = (churchName: string): { heading: string; body: string[] }[] => [
  {
    heading: "제1조 (목적)",
    body: [
      `본 약관은 ${churchName}(이하 '교회')가 운영하는 홈페이지(이하 '서비스')의 이용 조건 및 절차, 교회와 이용자의 권리·의무·책임 사항 등 기본적인 사항을 규정함을 목적으로 합니다.`,
    ],
  },
  {
    heading: "제2조 (용어의 정의)",
    body: [
      "'서비스'란 교회가 제공하는 홈페이지 및 부속 기능 일체를 말합니다.",
      "'이용자'란 본 약관에 따라 서비스를 이용하는 개인을 말합니다.",
      "'게시물'이란 이용자가 서비스 내에 게시한 글·사진·영상·파일·링크 등의 정보를 말합니다.",
    ],
  },
  {
    heading: "제3조 (약관의 효력 및 변경)",
    body: [
      "본 약관은 서비스 화면에 게시함으로써 효력을 발생합니다.",
      "교회는 필요한 경우 관련 법령에 위배되지 않는 범위에서 약관을 개정할 수 있으며, 개정된 약관은 시행 7일 전 공지합니다.",
      "이용자는 변경된 약관에 동의하지 않을 권리가 있으며, 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.",
    ],
  },
  {
    heading: "제4조 (서비스의 제공)",
    body: [
      "교회는 다음과 같은 서비스를 제공합니다.",
      "예배 안내 및 교회 소식 게시",
      "주일설교·목양칼럼·주보 등 영적 콘텐츠 제공",
      "새가족 등록·심방 요청·기도 제목 신청 접수",
      "기타 교회 공동체를 위한 부가 서비스",
    ],
  },
  {
    heading: "제5조 (서비스 이용)",
    body: [
      "이용자는 별도의 가입 절차 없이 자유롭게 서비스를 열람할 수 있습니다.",
      "다만 새가족 등록·심방 요청·기도 제목 신청 등 개인정보가 수반되는 기능은 정보주체의 자발적 입력 및 동의 후 이용 가능합니다.",
    ],
  },
  {
    heading: "제6조 (이용자의 의무)",
    body: [
      "이용자는 다음 행위를 하여서는 안 됩니다.",
      "타인의 정보를 도용하거나 허위 정보를 등록하는 행위",
      "교회 또는 제3자의 저작권 등 지적재산권을 침해하는 행위",
      "음란·폭력적·반사회적 게시물을 게재하거나 유포하는 행위",
      "서비스의 안정적 운영을 방해하는 행위",
    ],
  },
  {
    heading: "제7조 (게시물의 관리)",
    body: [
      "교회는 이용자가 게시한 게시물이 본 약관 또는 관련 법령에 위배된다고 판단되는 경우 사전 통보 없이 삭제할 수 있습니다.",
      "이용자는 본인이 게시한 게시물에 대한 일체의 책임을 지며, 이로 인한 분쟁 발생 시 교회는 책임지지 않습니다.",
    ],
  },
  {
    heading: "제8조 (서비스의 중단)",
    body: [
      "교회는 시스템 점검·교체, 통신 장애, 천재지변 등 불가항력으로 서비스 제공이 어려운 경우 일시적으로 중단할 수 있습니다.",
      "서비스 중단 시 가능한 사전에 공지하며, 부득이한 경우 사후에 즉시 안내합니다.",
    ],
  },
  {
    heading: "제9조 (책임의 한계)",
    body: [
      "교회는 이용자가 서비스를 이용하여 기대하는 영적·교제적 효용을 얻지 못한 것에 대하여 책임을 지지 않습니다.",
      "이용자 상호 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대하여 교회는 개입할 의무가 없습니다.",
    ],
  },
  {
    heading: "제10조 (분쟁의 해결)",
    body: [
      "본 약관과 관련하여 교회와 이용자 사이에 분쟁이 발생한 경우 양 당사자는 신의에 따라 성실히 협의하여 해결하도록 노력합니다.",
      "협의가 이루어지지 않은 경우 관할 법원은 「민사소송법」에 따라 정합니다.",
    ],
  },
  {
    heading: "부칙",
    body: ["본 약관은 2026년 5월 1일부터 시행합니다."],
  },
];

export default function TermsPage() {
  const ARTICLES = buildArticles(CHURCH.name);
  return (
    <>
      <PageHero eyebrow="TERMS" title="이용약관" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10 text-base leading-relaxed text-charcoal">
          {ARTICLES.map((a) => (
            <section key={a.heading}>
              <h2 className="text-lg font-bold text-primary-navy md:text-xl">
                {a.heading}
              </h2>
              <div className="mt-4 space-y-3 text-warm-gray">
                {a.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
