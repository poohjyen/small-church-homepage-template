import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Download, FileText } from "lucide-react";
import { getBulletinById, getAdjacentBulletin } from "@/lib/data/bulletins";
import { PageHero } from "@/components/layout/PageHero";
import { PostNav } from "@/components/board/PostNav";
import { BulletinPreview } from "@/components/bulletins/BulletinPreview";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const b = await getBulletinById(id);
  return { title: b?.title ?? "주보" };
}

export default async function BulletinDetailPage({ params }: Props) {
  const { id } = await params;
  const bulletin = await getBulletinById(id);
  if (!bulletin) notFound();

  const { prev, next } = await getAdjacentBulletin(bulletin.bulletin_date, bulletin.id);

  const dateLabel = format(new Date(bulletin.bulletin_date), "yyyy년 MM월 dd일");

  return (
    <>
      <PageHero eyebrow="BULLETIN" title="주보" />

      <article className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <header className="border-b border-slate-200 pb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary-sky">
              {dateLabel}
            </p>
            <h1 className="mt-3 text-2xl font-bold text-primary-navy md:text-3xl">
              {bulletin.title}
            </h1>
          </header>

          <div className="mt-10">
            {bulletin.thumbnail_url ? (
              <div className="mx-auto max-w-md">
                <BulletinPreview
                  src={bulletin.thumbnail_url}
                  alt={bulletin.title}
                />
                <p className="mt-3 text-center text-xs text-warm-gray">
                  표지 이미지를 클릭하면 크게 볼 수 있습니다.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-black/5 shadow-md">
                <div className="aspect-[3/4] w-full md:aspect-[4/3]">
                  <iframe
                    src={`${bulletin.pdf_url}#view=FitH`}
                    title={bulletin.title}
                    className="size-full bg-white"
                  />
                </div>
                <p className="bg-slate-900 px-4 py-3 text-center text-xs text-white/70">
                  PDF가 보이지 않으면 아래 다운로드 버튼을 눌러주세요.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={bulletin.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary-sky"
            >
              <FileText className="size-4" aria-hidden /> PDF 새 탭에서 열기
            </a>
            <a
              href={bulletin.pdf_url}
              download
              className="inline-flex items-center gap-2 rounded-md border border-primary-navy/30 bg-white px-6 py-3 text-sm font-semibold text-primary-navy transition hover:bg-primary-navy/5"
            >
              <Download className="size-4" aria-hidden /> 다운로드
            </a>
          </div>

          <PostNav
            prev={prev ? { href: `/bulletins/${prev.id}`, title: prev.title } : null}
            next={next ? { href: `/bulletins/${next.id}`, title: next.title } : null}
            listHref="/bulletins"
            listLabel="주보 목록"
          />
        </div>
      </article>
    </>
  );
}
