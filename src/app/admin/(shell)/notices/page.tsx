import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getNotices } from "@/lib/data/notices";
import { NoticesTable } from "./NoticesTable";

export const metadata = { title: "교회소식 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminNoticesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getNotices({
    page: 1,
    perPage: 100,
    category: "news",
    search,
  });

  return (
    <div>
      <AdminPageHeader
        title="교회소식"
        description={
          search
            ? `"${search}" 검색 결과 ${total}건`
            : `총 ${total}건 — 공개 페이지: /notices`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/notices/new?category=news">
                <Plus className="size-4" aria-hidden />새 소식 작성
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="제목·본문 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 교회소식이 없습니다."
          }
          hint={
            search
              ? "다른 검색어로 시도해 보세요."
              : "우측 상단 [새 소식 작성]에서 첫 글을 등록하세요."
          }
        />
      ) : (
        <NoticesTable data={data} hideCategory />
      )}
    </div>
  );
}
