import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getGalleries } from "@/lib/data/galleries";
import { GalleryGrid } from "./GalleryGrid";

export const metadata = { title: "갤러리 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminGalleryPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getGalleries({
    page: 1,
    perPage: 100,
    search,
  });

  return (
    <div>
      <AdminPageHeader
        title="갤러리"
        description={
          search
            ? `"${search}" 검색 결과 ${total}개 앨범`
            : `총 ${total}개 앨범`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/gallery/new">
                <Plus className="size-4" aria-hidden />
                새 앨범
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="앨범 제목·카테고리 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 앨범이 없습니다."
          }
        />
      ) : (
        <GalleryGrid data={data} />
      )}
    </div>
  );
}
