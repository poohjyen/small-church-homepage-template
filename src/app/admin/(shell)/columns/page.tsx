import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getColumns } from "@/lib/data/columns";
import { ColumnsTable } from "./ColumnsTable";

export const metadata = { title: "목양칼럼 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminColumnsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getColumns({ page: 1, perPage: 100, search });

  return (
    <div>
      <AdminPageHeader
        title="목양칼럼"
        description={
          search ? `"${search}" 검색 결과 ${total}건` : `총 ${total}건`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/columns/new">
                <Plus className="size-4" aria-hidden />
                새 칼럼 작성
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="제목·작성자·본문 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 목양칼럼이 없습니다."
          }
        />
      ) : (
        <ColumnsTable data={data} />
      )}
    </div>
  );
}
