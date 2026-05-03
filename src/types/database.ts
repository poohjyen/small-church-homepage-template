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
        Insert: Omit<Notice, "id" | "view_count" | "created_at" | "updated_at"> &
          Partial<Pick<Notice, "id" | "view_count" | "created_at" | "updated_at">>;
        Update: Partial<Notice>;
        Relationships: [];
      };
      sermons: {
        Row: Sermon;
        Insert: Omit<Sermon, "id" | "preacher" | "created_at"> &
          Partial<Pick<Sermon, "id" | "preacher" | "created_at">>;
        Update: Partial<Sermon>;
        Relationships: [];
      };
      pastoral_columns: {
        Row: PastoralColumn;
        Insert: Omit<PastoralColumn, "id" | "author" | "created_at"> &
          Partial<Pick<PastoralColumn, "id" | "author" | "created_at">>;
        Update: Partial<PastoralColumn>;
        Relationships: [];
      };
      bulletins: {
        Row: Bulletin;
        Insert: Omit<Bulletin, "id" | "created_at"> &
          Partial<Pick<Bulletin, "id" | "created_at">>;
        Update: Partial<Bulletin>;
        Relationships: [];
      };
      galleries: {
        Row: Gallery;
        Insert: Omit<Gallery, "id" | "created_at"> &
          Partial<Pick<Gallery, "id" | "created_at">>;
        Update: Partial<Gallery>;
        Relationships: [];
      };
      gallery_images: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, "id" | "display_order" | "created_at"> &
          Partial<Pick<GalleryImage, "id" | "display_order" | "created_at">>;
        Update: Partial<GalleryImage>;
        Relationships: [];
      };
      resources: {
        Row: Resource;
        Insert: Omit<Resource, "id" | "download_count" | "created_at"> &
          Partial<Pick<Resource, "id" | "download_count" | "created_at">>;
        Update: Partial<Resource>;
        Relationships: [];
      };
      newcomer_forms: {
        Row: NewcomerForm;
        Insert: Omit<NewcomerForm, "id" | "status" | "created_at"> &
          Partial<Pick<NewcomerForm, "id" | "status" | "created_at">>;
        Update: Partial<NewcomerForm>;
        Relationships: [];
      };
      prayer_requests: {
        Row: PrayerRequest;
        Insert: Omit<PrayerRequest, "id" | "status" | "is_anonymous" | "created_at"> &
          Partial<Pick<PrayerRequest, "id" | "status" | "is_anonymous" | "created_at">>;
        Update: Partial<PrayerRequest>;
        Relationships: [];
      };
      visit_requests: {
        Row: VisitRequest;
        Insert: Omit<VisitRequest, "id" | "status" | "created_at"> &
          Partial<Pick<VisitRequest, "id" | "status" | "created_at">>;
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
        Insert: Omit<HeroSlide, "id" | "display_order" | "is_active" | "created_at"> &
          Partial<Pick<HeroSlide, "id" | "display_order" | "is_active" | "created_at">>;
        Update: Partial<HeroSlide>;
        Relationships: [];
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, "id" | "category" | "display_order" | "created_at"> &
          Partial<Pick<Video, "id" | "category" | "display_order" | "created_at">>;
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
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
  view_count: number;
  category: NoticeCategory;
  created_at: string;
  updated_at: string;
};

export type Sermon = {
  id: string;
  title: string;
  scripture: string | null;
  preacher: string;
  youtube_id: string;
  summary: string | null;
  sermon_date: string;
  created_at: string;
};

export type PastoralColumn = {
  id: string;
  title: string;
  content: string;
  author: string;
  published_date: string;
  created_at: string;
};

export type Bulletin = {
  id: string;
  title: string;
  pdf_url: string;
  thumbnail_url: string | null;
  bulletin_date: string;
  created_at: string;
};

export type Gallery = {
  id: string;
  title: string;
  category: string;
  cover_image: string | null;
  event_date: string | null;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  gallery_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
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

export type SettingValueMap = {
  year_motto: { year: number; motto: string; scripture: string; body: string };
  vision_three: { v1: string; v2: string; v3: string };
  contact: { address: string; phone: string; account: string };
  sns: { band: string; youtube: string; instagram: string };
  admin_email: string;
  page_hero_images: Record<string, string>;
  pastor_greeting: { name: string; photo_url: string; body: string };
  worship_schedules: { items: WorshipScheduleItem[] };
  dawn_prayers: { items: DawnPrayerItem[] };
  offering_accounts: { items: OfferingAccountItem[] };
  admin_name: string;
  landing_sections: { items: { key: string; visible: boolean }[] };
};

export type HeroSlide = {
  id: string;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
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
};
