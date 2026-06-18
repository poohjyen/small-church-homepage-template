// ============================================
// 교회 홈페이지 DB 타입 정의 (Supabase)
// supabase/migrations/0001_init.sql과 1:1 대응
// ============================================

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      notices: {
        Row: Notice;
        Insert: Omit<Notice, "id" | "view_count" | "created_at" | "updated_at" | "is_draft" | "deleted_at"> &
          Partial<Pick<Notice, "id" | "view_count" | "created_at" | "updated_at" | "is_draft" | "deleted_at">>;
        Update: Partial<Notice>;
        Relationships: [];
      };
      sermons: {
        Row: Sermon;
        Insert: Omit<Sermon, "id" | "preacher" | "created_at" | "is_draft" | "deleted_at"> &
          Partial<Pick<Sermon, "id" | "preacher" | "created_at" | "is_draft" | "deleted_at">>;
        Update: Partial<Sermon>;
        Relationships: [];
      };
      pastoral_columns: {
        Row: PastoralColumn;
        Insert: Omit<PastoralColumn, "id" | "author" | "created_at" | "is_draft" | "deleted_at"> &
          Partial<Pick<PastoralColumn, "id" | "author" | "created_at" | "is_draft" | "deleted_at">>;
        Update: Partial<PastoralColumn>;
        Relationships: [];
      };
      bulletins: {
        Row: Bulletin;
        Insert: Omit<Bulletin, "id" | "created_at" | "is_draft" | "deleted_at"> &
          Partial<Pick<Bulletin, "id" | "created_at" | "is_draft" | "deleted_at">>;
        Update: Partial<Bulletin>;
        Relationships: [];
      };
      galleries: {
        Row: Gallery;
        Insert: Omit<Gallery, "id" | "created_at" | "deleted_at"> &
          Partial<Pick<Gallery, "id" | "created_at" | "deleted_at">>;
        Update: Partial<Gallery>;
        Relationships: [];
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, "id" | "display_order" | "created_at" | "deleted_at"> &
          Partial<Pick<GalleryImage, "id" | "display_order" | "created_at" | "deleted_at">>;
        Update: Partial<GalleryImage>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, "id" | "download_count" | "created_at" | "deleted_at"> &
          Partial<Pick<Resource, "id" | "download_count" | "created_at" | "deleted_at">>;
        Update: Partial<Resource>;
        Relationships: [];
      };
      newcomer_forms: {
        Row: NewcomerForm;
        Insert: Omit<NewcomerForm, "id" | "status" | "created_at" | "deleted_at"> &
          Partial<Pick<NewcomerForm, "id" | "status" | "created_at" | "deleted_at">>;
        Update: Partial<NewcomerForm>;
        Relationships: [];
      };
      prayer_requests: {
        Row: PrayerRequest;
        Insert: Omit<PrayerRequest, "id" | "status" | "is_anonymous" | "created_at" | "deleted_at"> &
          Partial<Pick<PrayerRequest, "id" | "status" | "is_anonymous" | "created_at" | "deleted_at">>;
        Update: Partial<PrayerRequest>;
        Relationships: [];
      };
      visit_requests: {
        Row: VisitRequest;
        Insert: Omit<VisitRequest, "id" | "status" | "created_at" | "deleted_at"> &
          Partial<Pick<VisitRequest, "id" | "status" | "created_at" | "deleted_at">>;
        Update: Partial<VisitRequest>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "updated_at"> & Partial<Pick<SiteSetting, "updated_at">>;
        Update: Partial<SiteSetting>;
        Relationships: [];
      };
      hero_slides: {
        Row: HeroSlide;
        Insert: Omit<HeroSlide, "id" | "display_order" | "is_active" | "created_at" | "deleted_at"> &
          Partial<Pick<HeroSlide, "id" | "display_order" | "is_active" | "created_at" | "deleted_at">>;
        Update: Partial<HeroSlide>;
        Relationships: [];
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, "id" | "category" | "display_order" | "created_at" | "deleted_at"> &
          Partial<Pick<Video, "id" | "category" | "display_order" | "created_at" | "deleted_at">>;
        Update: Partial<Video>;
        Relationships: [];
      };
      page_blocks: {
        Row: PageBlock;
        Insert: Omit<PageBlock, "id" | "created_at" | "updated_at"> &
          Partial<Pick<PageBlock, "id" | "created_at" | "updated_at">>;
        Update: Partial<PageBlock>;
        Relationships: [];
      };
      site_popups: {
        Row: SitePopup;
        Insert: Omit<SitePopup, "id" | "created_at" | "updated_at" | "deleted_at"> &
          Partial<
            Pick<SitePopup, "id" | "created_at" | "updated_at" | "deleted_at">
          >;
        Update: Partial<SitePopup>;
        Relationships: [];
      };
      donation_receipts: {
        Row: DonationReceipt;
        Insert: Omit<
          DonationReceipt,
          "id" | "status" | "created_at" | "deleted_at"
        > &
          Partial<
            Pick<DonationReceipt, "id" | "status" | "created_at" | "deleted_at">
          >;
        Update: Partial<DonationReceipt>;
        Relationships: [];
      };
      page_views: {
        Row: PageView;
        Insert: Omit<PageView, "id" | "created_at"> &
          Partial<Pick<PageView, "id" | "created_at">>;
        Update: Partial<PageView>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_visitor_stats: {
        Args: { days?: number };
        Returns: VisitorStatsJson;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ============================================
// Row 타입 (단일 사용 시)
// ============================================

export type NoticeCategory = "news" | "schedule";

export type Notice = {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_draft: boolean;
  view_count: number;
  category: NoticeCategory;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Sermon = {
  id: string;
  title: string;
  scripture: string | null;
  preacher: string;
  youtube_id: string;
  summary: string | null;
  sermon_date: string;
  is_draft: boolean;
  created_at: string;
  deleted_at: string | null;
};

export type PastoralColumn = {
  id: string;
  title: string;
  content: string;
  author: string;
  published_date: string;
  is_draft: boolean;
  created_at: string;
  deleted_at: string | null;
};

export type Bulletin = {
  id: string;
  title: string;
  pdf_url: string;
  thumbnail_url: string | null;
  bulletin_date: string;
  is_draft: boolean;
  created_at: string;
  deleted_at: string | null;
};

export type Gallery = {
  id: string;
  title: string;
  category: string;
  cover_image: string | null;
  event_date: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type GalleryImage = {
  id: string;
  gallery_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
  deleted_at: string | null;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  file_url: string;
  file_size: number | null;
  download_count: number;
  created_at: string;
  deleted_at: string | null;
};

export type FormStatus = "new" | "contacted" | "completed" | "archived";

export type NewcomerForm = {
  id: string;
  name: string;
  phone: string;
  birthdate: string | null;
  address: string | null;
  family_info: string | null;
  visit_reason: string | null;
  previous_church: string | null;
  status: FormStatus;
  admin_memo: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type PrayerRequest = {
  id: string;
  is_anonymous: boolean;
  name: string | null;
  phone: string | null;
  content: string;
  status: FormStatus;
  admin_memo: string | null;
  created_at: string;
  deleted_at: string | null;
};

export type VisitRequest = {
  id: string;
  name: string;
  phone: string;
  address: string;
  requested_date: string | null;
  requested_time: string | null;
  reason: string | null;
  status: FormStatus;
  admin_memo: string | null;
  created_at: string;
  deleted_at: string | null;
};

// site_settings — key별 value 스키마는 SettingValueMap으로 별도 관리
export type SiteSetting = {
  key: string;
  value: unknown;
  updated_at: string;
};

export type WorshipAccent =
  | "navy"
  | "navy-dark"
  | "navy-light"
  | "teal"
  | "amber";

export type WorshipScheduleItem = {
  title: string;
  day: string;
  time: string;
  place: string;
  accent: WorshipAccent;
};

export type DawnPrayerItem = {
  day: string;
  topic: string;
};

export type OfferingAccountItem = {
  dept: string;
  account: string;
};

export type MissionsCardValue = {
  image_url: string;
  title: string;
  body: string;
  cta_label: string;
  cta_href: string;
};

export type ParallaxBandValue = {
  image: string;
  headline: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
};

export type SettingValueMap = {
  year_motto: { year: number; motto: string; scripture: string; body: string };
  vision_three: { v1: string; v2: string; v3: string };
  contact: { address: string; phone: string; account: string };
  sns: { band: string; youtube: string; instagram: string };
  admin_email: string;
  admin_emails: string[];
  page_hero_images: Record<string, string>;
  pastor_greeting: { name: string; photo_url: string; body: string };
  worship_schedules: { items: WorshipScheduleItem[] };
  dawn_prayers: { items: DawnPrayerItem[] };
  offering_accounts: { items: OfferingAccountItem[] };
  admin_name: string;
  landing_sections: { items: { key: string; visible: boolean }[] };
  vision_image_url: string;
  missions_card: MissionsCardValue;
  parallax_bands: Record<
    | "home"
    | "about"
    | "vision"
    | "worship"
    | "location"
    // 홈 색상 띠를 사진 배경 패럴럭스로 전환할 때 쓰는 배경 사진 (이미지만 사용, 문구는 섹션에 내장)
    | "home_invite"
    | "home_giving",
    ParallaxBandValue
  >;
};

export type HeroSlide = {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  deleted_at: string | null;
};

export type PageBlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "quote"
  | "youtube";

export type PageBlock = {
  id: string;
  page_key: string;
  type: PageBlockType;
  title: string | null;
  body: string | null;
  youtube_id: string | null;
  image_url: string | null;
  image_alt: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  category: string;
  youtube_id: string;
  description: string | null;
  performer: string | null;
  video_date: string;
  display_order: number;
  created_at: string;
  deleted_at: string | null;
};

// ── 기부금영수증 신청 (0009_donation_receipts) ──
export type DonationDeliveryMethod = "pickup" | "email" | "fax";

export type DonationReceipt = {
  id: string;
  name: string;
  birthdate: string;
  phone: string;
  address: string;
  delivery_method: DonationDeliveryMethod;
  delivery_email: string | null;
  delivery_fax: string | null;
  note: string | null;
  status: FormStatus;
  admin_memo: string | null;
  created_at: string;
  deleted_at: string | null;
};

// ── 사이트 팝업/배너 (0010_site_popups) ──
export const POPUP_POSITIONS = [
  "center",
  "top-right",
  "bottom-right",
  "top-left",
  "bottom-left",
] as const;
export type PopupPosition = (typeof POPUP_POSITIONS)[number];

export type SitePopup = {
  id: string;
  title: string;
  image_url: string;
  image_alt: string | null;
  link_url: string | null;
  link_target: "_self" | "_blank";
  starts_at: string;
  ends_at: string;
  position: PopupPosition;
  width: number;
  width_mobile: number;
  display_priority: number;
  show_dont_show_today: boolean;
  show_close_button: boolean;
  pages: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

// ── 방문자 통계 (0022_page_views, 0023_visitor_stats_fn) ──
export type PageViewDevice = "pc" | "mobile" | "tablet" | "unknown";

export type PageView = {
  id: number;
  path: string;
  referrer_host: string | null;
  device: PageViewDevice;
  visitor_hash: string;
  created_at: string;
};

// get_visitor_stats RPC 반환 형태
export type VisitorStatsJson = {
  daily: { date: string; views: number; visitors: number }[];
  today: { views: number; visitors: number };
  yesterday: { views: number; visitors: number };
  last7: { views: number; visitors: number };
  topPages: { path: string; views: number }[];
  topReferrers: { host: string; count: number }[];
  devices: { pc: number; mobile: number; tablet: number; unknown: number };
  total: number;
};
