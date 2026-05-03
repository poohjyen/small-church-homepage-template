export type NavChild = { label: string; href: string };
export type NavGroup = {
  label: string;
  children: NavChild[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "교회안내",
    children: [
      { label: "인사말", href: "/about" },
      { label: "교회 비전", href: "/about/vision" },
      { label: "예배 안내", href: "/about/worship" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    label: "예배와 말씀",
    children: [
      { label: "주일설교", href: "/sermons" },
      { label: "목양칼럼", href: "/columns" },
      { label: "특별영상", href: "/videos" },
    ],
  },
  {
    label: "교회소식",
    children: [
      { label: "주보", href: "/bulletins" },
      { label: "교회소식", href: "/notices" },
      { label: "교회일정", href: "/schedules" },
      { label: "갤러리", href: "/gallery" },
    ],
  },
  {
    label: "선교소식",
    children: [{ label: "필리핀선교", href: "/missions" }],
  },
  {
    label: "온라인 행정",
    children: [
      { label: "새가족 등록", href: "/forms/newcomer" },
      { label: "기도제목", href: "/forms/prayer" },
      { label: "심방 요청", href: "/forms/visit" },
      { label: "자료실", href: "/resources" },
    ],
  },
];
