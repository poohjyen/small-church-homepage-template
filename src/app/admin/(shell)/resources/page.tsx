import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getResources } from "@/lib/data/resources";
import { ResourcesTable } from "./ResourcesTable";

export const metadata = { title: "자료실 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminResourcesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getResources({
    page: 1,
    perPage: 100,
    search,
  });

  return (
    <div>
      <AdminPageHeader
        title="자료실"
        description={
          search ? `"${search}" 검색 결과 ${total}건` : `총 ${total}건`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/resources/new">
                <Plus className="size-4" aria-hidden />
                새 자료 업로드
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="자료 제목·설명 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 자료가 없습니다."
          }
        />
      ) : (
        <ResourcesTable data={data} />
      )}
    </div>
  );
}
