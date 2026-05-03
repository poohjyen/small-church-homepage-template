import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getSermons } from "@/lib/data/sermons";
import { SermonsTable } from "./SermonsTable";

export const metadata = { title: "주일설교 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminSermonsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getSermons({ page: 1, perPage: 100, search });

  return (
    <div>
      <AdminPageHeader
        title="주일설교"
        description={
          search ? `"${search}" 검색 결과 ${total}건` : `총 ${total}건`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/sermons/new">
                <Plus className="size-4" aria-hidden />
                새 설교 등록
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="제목·설교자·본문 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 주일설교가 없습니다."
          }
        />
      ) : (
        <SermonsTable data={data} />
      )}
    </div>
  );
}
