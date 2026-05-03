import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getBulletins } from "@/lib/data/bulletins";
import { BulletinsTable } from "./BulletinsTable";

export const metadata = { title: "주보 관리" };

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminBulletinsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const search = q?.trim() || undefined;
  const { data, total } = await getBulletins({
    page: 1,
    perPage: 100,
    search,
  });

  return (
    <div>
      <AdminPageHeader
        title="주보"
        description={
          search
            ? `"${search}" 검색 결과 ${total}건`
            : `총 ${total}건 · 주보 등록 시 목양칼럼도 함께 등록할 수 있습니다.`
        }
        actions={
          <Button
            className="bg-primary-navy text-white hover:bg-secondary-sky"
            render={
              <Link href="/admin/bulletins/new">
                <Plus className="size-4" aria-hidden />
                새 주보 등록
              </Link>
            }
          />
        }
      />

      <div className="mb-4">
        <AdminSearchBar placeholder="제목 검색" />
      </div>

      {data.length === 0 ? (
        <AdminEmptyState
          message={
            search
              ? `"${search}" 검색 결과가 없습니다.`
              : "등록된 주보가 없습니다."
          }
        />
      ) : (
        <BulletinsTable data={data} />
      )}
    </div>
  );
}
