import {
  LayoutDashboard,
  Megaphone,
  CalendarDays,
  FileText,
  Mic,
  Pen,
  Image as ImageIcon,
  Globe,
  FolderOpen,
  UserPlus,
  HandHeart,
  Home,
  Settings,
  Images,
  Film,
  Sparkles,
  Files,
  LayoutPanelTop,
  PictureInPicture2,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const ADMIN_TOP_ITEM: AdminNavItem = {
  label: "대시보드",
  href: "/admin",
  icon: LayoutDashboard,
};

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: "콘텐츠 관리",
    items: [
      { label: "교회소식", href: "/admin/notices", icon: Megaphone },
      { label: "교회일정", href: "/admin/schedules", icon: CalendarDays },
      { label: "주보", href: "/admin/bulletins", icon: FileText },
      { label: "주일설교", href: "/admin/sermons", icon: Mic },
      { label: "목양칼럼", href: "/admin/columns", icon: Pen },
      { label: "특별영상", href: "/admin/videos", icon: Film },
      { label: "갤러리", href: "/admin/gallery", icon: ImageIcon },
      { label: "자료실", href: "/admin/resources", icon: FolderOpen },
    ],
  },
  {
    label: "페이지 콘텐츠",
    items: [
      { label: "선교 페이지", href: "/admin/missions", icon: Globe },
      { label: "인사말 추가", href: "/admin/about", icon: Sparkles },
      { label: "사용자 페이지", href: "/admin/pages", icon: Files },
    ],
  },
  {
    label: "신청 관리",
    items: [
      { label: "새가족", href: "/admin/forms/newcomer", icon: UserPlus },
      { label: "기도제목", href: "/admin/forms/prayer", icon: HandHeart },
      { label: "심방 요청", href: "/admin/forms/visit", icon: Home },
      {
        label: "기부금 영수증",
        href: "/admin/forms/donation-receipt",
        icon: ReceiptText,
      },
    ],
  },
  {
    label: "설정",
    items: [
      { label: "사이트 설정", href: "/admin/settings", icon: Settings },
      { label: "히어로 슬라이드", href: "/admin/hero", icon: Images },
      { label: "랜딩 섹션 순서", href: "/admin/landing", icon: LayoutPanelTop },
      { label: "팝업/배너", href: "/admin/popups", icon: PictureInPicture2 },
    ],
  },
];
