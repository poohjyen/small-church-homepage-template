import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getVideos } from "@/lib/data/videos";
import { VideosTable } from "./VideosTable";

export const metadata = { title: "특별영상 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminVideosPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getVideos({ page: 1, perPage: 100, search });

  return (
    <div>
      <AdminPageHeader
        title="특별영상"
        description={
          search ? `"${search}" 검색 결과 ${total}건` : `총 ${total}건`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/videos/new">
                <Plus className="size-4" aria-hidden />
                새 영상 등록
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="제목·출연·설명 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 특별영상이 없습니다."
          }
        />
      ) : (
        <VideosTable data={data} />
      )}
    </div>
  );
}
