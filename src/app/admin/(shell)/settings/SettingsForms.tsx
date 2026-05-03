"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormDirty } from "@/lib/hooks/useFormDirty";
import type {
  DawnPrayerItem,
  OfferingAccountItem,
  SettingValueMap,
  WorshipAccent,
  WorshipScheduleItem,
} from "@/types/database";
import {
  saveAdminEmail,
  saveAdminName,
  saveContact,
  saveDawnPrayers,
  saveOfferingAccounts,
  savePageHeroImages,
  savePastorGreeting,
  saveSns,
  saveVisionThree,
  saveWorshipSchedules,
  saveYearMotto,
} from "./actions";

type Result = { ok: true } | { ok: false; error: string };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-charcoal">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-warm-gray">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <div className="mt-4 flex justify-end">
      <Button
        type="submit"
        className="bg-primary-navy text-white hover:bg-secondary-sky"
        disabled={pending}
      >
        <Save className="size-4" aria-hidden />
        {pending ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}

function useSaveAction<T>(action: (input: T) => Promise<Result>) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  function save(input: T) {
    startTransition(async () => {
      const result = await action(input);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("저장되었습니다.");
      router.refresh();
    });
  }
  return { pending, save };
}

function DirtyForm({
  pending,
  onSubmit,
  className,
  children,
}: {
  pending: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  useFormDirty(formRef, { pending });
  return (
    <form ref={formRef} onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
}

export function YearMottoSection({
  initial,
}: {
  initial: SettingValueMap["year_motto"] | null;
}) {
  const { pending, save } = useSaveAction(saveYearMotto);
  const [year, setYear] = useState(String(initial?.year ?? new Date().getFullYear()));
  const [motto, setMotto] = useState(initial?.motto ?? "");
  const [scripture, setScripture] = useState(initial?.scripture ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  return (
    <Section
      title="올해의 표어"
      description="홈/소개 페이지에 노출되는 올해 표어와 본문입니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ year: Number(year), motto, scripture, body });
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-[120px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="ym_year">연도</Label>
            <Input
              id="ym_year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ym_motto">표어</Label>
            <Input
              id="ym_motto"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="예: 하나되어 내일을 준비하라"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ym_scripture">말씀</Label>
          <Input
            id="ym_scripture"
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            placeholder="예: 빌립보서 2:2-4"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ym_body">본문</Label>
          <Textarea
            id="ym_body"
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function VisionThreeSection({
  initial,
}: {
  initial: SettingValueMap["vision_three"] | null;
}) {
  const { pending, save } = useSaveAction(saveVisionThree);
  const [v1, setV1] = useState(initial?.v1 ?? "");
  const [v2, setV2] = useState(initial?.v2 ?? "");
  const [v3, setV3] = useState(initial?.v3 ?? "");

  return (
    <Section title="비전 3대 영역" description="소개 페이지의 3대 비전 키워드/문장입니다.">
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ v1, v2, v3 });
        }}
        className="space-y-3"
      >
        <div className="space-y-2">
          <Label htmlFor="v1">비전 1</Label>
          <Input id="v1" value={v1} onChange={(e) => setV1(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="v2">비전 2</Label>
          <Input id="v2" value={v2} onChange={(e) => setV2(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="v3">비전 3</Label>
          <Input id="v3" value={v3} onChange={(e) => setV3(e.target.value)} />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function ContactSection({
  initial,
}: {
  initial: SettingValueMap["contact"] | null;
}) {
  const { pending, save } = useSaveAction(saveContact);
  const [address, setAddress] = useState(initial?.address ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [account, setAccount] = useState(initial?.account ?? "");

  return (
    <Section title="연락처" description="푸터·연락 페이지에 노출되는 정보입니다.">
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ address, phone, account });
        }}
        className="space-y-3"
      >
        <div className="space-y-2">
          <Label htmlFor="c_address">주소</Label>
          <Input id="c_address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c_phone">전화번호</Label>
          <Input id="c_phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c_account">계좌</Label>
          <Input id="c_account" value={account} onChange={(e) => setAccount(e.target.value)} />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function SnsSection({
  initial,
}: {
  initial: SettingValueMap["sns"] | null;
}) {
  const { pending, save } = useSaveAction(saveSns);
  const [band, setBand] = useState(initial?.band ?? "");
  const [youtube, setYoutube] = useState(initial?.youtube ?? "");
  const [instagram, setInstagram] = useState(initial?.instagram ?? "");

  return (
    <Section title="SNS" description="외부 채널 링크입니다.">
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ band, youtube, instagram });
        }}
        className="space-y-3"
      >
        <div className="space-y-2">
          <Label htmlFor="sns_band">밴드</Label>
          <Input
            id="sns_band"
            value={band}
            onChange={(e) => setBand(e.target.value)}
            placeholder="https://band.us/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sns_youtube">유튜브</Label>
          <Input
            id="sns_youtube"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            placeholder="https://youtube.com/@..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sns_instagram">인스타그램</Label>
          <Input
            id="sns_instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

const PAGE_HERO_KEYS: { key: string; label: string; fallback: string }[] = [
  { key: "about", label: "교회안내 — 인사말", fallback: "" },
  { key: "about/worship", label: "교회안내 — 예배 안내", fallback: "" },
  { key: "about/location", label: "교회안내 — 오시는 길", fallback: "" },
  { key: "about/vision", label: "교회안내 — 교회 비전", fallback: "" },
  { key: "sermons", label: "예배와 말씀 — 주일설교", fallback: "" },
  { key: "columns", label: "예배와 말씀 — 목양칼럼", fallback: "" },
  { key: "missions", label: "선교소식", fallback: "" },
];

export function PageHeroImagesSection({
  initial,
}: {
  initial: SettingValueMap["page_hero_images"] | null;
}) {
  const { pending, save } = useSaveAction(savePageHeroImages);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      PAGE_HERO_KEYS.map(({ key }) => [key, initial?.[key] ?? ""]),
    ),
  );

  return (
    <Section
      title="페이지별 상단 이미지"
      description="각 카테고리 페이지의 상단 배너 이미지 URL입니다. 비워두면 기본 이미지를 사용합니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save(values);
        }}
        className="space-y-3"
      >
        {PAGE_HERO_KEYS.map(({ key, label, fallback }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`phi_${key}`}>{label}</Label>
            <Input
              id={`phi_${key}`}
              value={values[key] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={fallback}
            />
          </div>
        ))}
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function AdminEmailSection({
  initial,
}: {
  initial: string | null;
}) {
  const { pending, save } = useSaveAction(saveAdminEmail);
  const [email, setEmail] = useState(initial ?? "");

  return (
    <Section
      title="관리자 이메일"
      description="공개 폼(새가족·기도제목·심방신청) 알림 메일을 받을 주소입니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ admin_email: email });
        }}
        className="space-y-3"
      >
        <div className="space-y-2">
          <Label htmlFor="admin_email">이메일</Label>
          <Input
            id="admin_email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function AdminNameSection({
  initial,
}: {
  initial: string | null;
}) {
  const { pending, save } = useSaveAction(saveAdminName);
  const [name, setName] = useState(initial ?? "");

  return (
    <Section
      title="대표 이름"
      description="대시보드 인사말과 인사말 페이지 캡션에 노출됩니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ admin_name: name });
        }}
        className="space-y-3"
      >
        <div className="space-y-2">
          <Label htmlFor="admin_name">이름</Label>
          <Input
            id="admin_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 홍길동 목사"
          />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

export function PastorGreetingSection({
  initial,
}: {
  initial: SettingValueMap["pastor_greeting"] | null;
}) {
  const { pending, save } = useSaveAction(savePastorGreeting);
  const [name, setName] = useState(initial?.name ?? "");
  const [photoUrl, setPhotoUrl] = useState(initial?.photo_url ?? "");
  const [body, setBody] = useState(initial?.body ?? "");

  return (
    <Section
      title="인사말 페이지 본문"
      description="교회안내 → 인사말 페이지의 담임목사 인사말입니다. 빈 줄로 단락을 구분하면 본문에 그대로 반영됩니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ name, photo_url: photoUrl, body });
        }}
        className="space-y-3"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pg_name">담임목사 이름</Label>
            <Input
              id="pg_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pg_photo">사진 경로</Label>
            <Input
              id="pg_photo"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="/images/pastor.jpg"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pg_body">인사말 본문</Label>
          <Textarea
            id="pg_body"
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="저희 교회 홈페이지를 찾아주신..."
          />
        </div>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

const ACCENT_OPTIONS: { value: WorshipAccent; label: string }[] = [
  { value: "navy", label: "남색" },
  { value: "navy-dark", label: "남색 진함" },
  { value: "navy-light", label: "남색 연함" },
  { value: "teal", label: "청록" },
  { value: "amber", label: "노랑" },
];

const DEFAULT_WORSHIP: WorshipScheduleItem = {
  title: "",
  day: "",
  time: "",
  place: "",
  accent: "navy",
};

export function WorshipSchedulesSection({
  initial,
}: {
  initial: SettingValueMap["worship_schedules"] | null;
}) {
  const { pending, save } = useSaveAction(saveWorshipSchedules);
  const [items, setItems] = useState<WorshipScheduleItem[]>(
    initial?.items?.length ? initial.items : [DEFAULT_WORSHIP],
  );

  function update<K extends keyof WorshipScheduleItem>(
    idx: number,
    key: K,
    value: WorshipScheduleItem[K],
  ) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    );
  }

  return (
    <Section
      title="주간 예배 일정"
      description="홈/예배안내 페이지에 노출되는 주일·주중 예배 시간표입니다. 여러 개 등록할 수 있습니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ items });
        }}
        className="space-y-4"
      >
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-black/5 bg-soft p-4"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`ws_title_${idx}`}>예배 이름</Label>
                  <Input
                    id={`ws_title_${idx}`}
                    value={it.title}
                    onChange={(e) => update(idx, "title", e.target.value)}
                    placeholder="예: 주일오전 영광예배"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ws_day_${idx}`}>요일</Label>
                  <Input
                    id={`ws_day_${idx}`}
                    value={it.day}
                    onChange={(e) => update(idx, "day", e.target.value)}
                    placeholder="예: 일 / 수 / 매일"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ws_time_${idx}`}>시간</Label>
                  <Input
                    id={`ws_time_${idx}`}
                    value={it.time}
                    onChange={(e) => update(idx, "time", e.target.value)}
                    placeholder="예: 11:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ws_place_${idx}`}>장소</Label>
                  <Input
                    id={`ws_place_${idx}`}
                    value={it.place}
                    onChange={(e) => update(idx, "place", e.target.value)}
                    placeholder="예: 본당"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`ws_accent_${idx}`}>색상 강조</Label>
                  <select
                    id={`ws_accent_${idx}`}
                    value={it.accent}
                    onChange={(e) =>
                      update(idx, "accent", e.target.value as WorshipAccent)
                    }
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                  >
                    {ACCENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-red-600"
                  onClick={() =>
                    setItems((prev) =>
                      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx),
                    )
                  }
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" aria-hidden />
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, DEFAULT_WORSHIP])}
        >
          <Plus className="size-4" aria-hidden />
          예배 추가
        </Button>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

const DEFAULT_OFFERING: OfferingAccountItem = { dept: "", account: "" };

export function OfferingAccountsSection({
  initial,
}: {
  initial: SettingValueMap["offering_accounts"] | null;
}) {
  const { pending, save } = useSaveAction(saveOfferingAccounts);
  const [items, setItems] = useState<OfferingAccountItem[]>(
    initial?.items?.length ? initial.items : [DEFAULT_OFFERING],
  );

  function update<K extends keyof OfferingAccountItem>(
    idx: number,
    key: K,
    value: OfferingAccountItem[K],
  ) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    );
  }

  return (
    <Section
      title="온라인 헌금 계좌"
      description="홈/푸터의 헌금 안내에 노출됩니다. 부서별로 등록하세요. 예: 재정부 / 은행 ○○○-○○○○○○○-○○"
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ items });
        }}
        className="space-y-4"
      >
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-black/5 bg-soft p-4"
            >
              <div className="grid gap-3 md:grid-cols-[140px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor={`oa_dept_${idx}`}>부서</Label>
                  <Input
                    id={`oa_dept_${idx}`}
                    value={it.dept}
                    onChange={(e) => update(idx, "dept", e.target.value)}
                    placeholder="예: 재정부"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`oa_account_${idx}`}>계좌</Label>
                  <Input
                    id={`oa_account_${idx}`}
                    value={it.account}
                    onChange={(e) => update(idx, "account", e.target.value)}
                    placeholder="예: 은행명 ○○○-○○○○○○○-○○"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-red-600"
                  onClick={() =>
                    setItems((prev) =>
                      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx),
                    )
                  }
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" aria-hidden />
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, DEFAULT_OFFERING])}
        >
          <Plus className="size-4" aria-hidden />
          계좌 추가
        </Button>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}

const DEFAULT_DAWN: DawnPrayerItem = { day: "", topic: "" };

export function DawnPrayersSection({
  initial,
}: {
  initial: SettingValueMap["dawn_prayers"] | null;
}) {
  const { pending, save } = useSaveAction(saveDawnPrayers);
  const [items, setItems] = useState<DawnPrayerItem[]>(
    initial?.items?.length ? initial.items : [DEFAULT_DAWN],
  );

  function update<K extends keyof DawnPrayerItem>(
    idx: number,
    key: K,
    value: DawnPrayerItem[K],
  ) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: value } : it)),
    );
  }

  return (
    <Section
      title="새벽 은혜기도회 — 요일별 기도제목"
      description="예배안내 페이지 하단에 노출되는 요일별 기도제목입니다."
    >
      <DirtyForm
        pending={pending}
        onSubmit={(e) => {
          e.preventDefault();
          save({ items });
        }}
        className="space-y-4"
      >
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-black/5 bg-soft p-4"
            >
              <div className="grid gap-3 md:grid-cols-[120px_1fr]">
                <div className="space-y-2">
                  <Label htmlFor={`dp_day_${idx}`}>요일</Label>
                  <Input
                    id={`dp_day_${idx}`}
                    value={it.day}
                    onChange={(e) => update(idx, "day", e.target.value)}
                    placeholder="예: 월"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`dp_topic_${idx}`}>기도제목</Label>
                  <Input
                    id={`dp_topic_${idx}`}
                    value={it.topic}
                    onChange={(e) => update(idx, "topic", e.target.value)}
                    placeholder="예: 나라와 민족을 위하여"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-warm-gray hover:text-red-600"
                  onClick={() =>
                    setItems((prev) =>
                      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx),
                    )
                  }
                  disabled={items.length === 1}
                >
                  <Trash2 className="size-4" aria-hidden />
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, DEFAULT_DAWN])}
        >
          <Plus className="size-4" aria-hidden />
          기도제목 추가
        </Button>
        <SubmitButton pending={pending} />
      </DirtyForm>
    </Section>
  );
}
