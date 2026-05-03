import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";
import { CHURCH } from "../../church.config";

export const metadata = {
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-soft px-6 py-16">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center ring-1 ring-black/5 sm:p-12">
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
          <Compass className="size-8" strokeWidth={1.5} aria-hidden />
        </div>

        <p className="mt-6 text-sm font-semibold tracking-wide text-secondary-sky">
          404 NOT FOUND
        </p>
        <h1 className="mt-2 text-2xl font-bold text-charcoal sm:text-3xl">
          요청하신 페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-warm-gray">
          주소가 변경되었거나 삭제된 페이지일 수 있습니다.
          <br />
          {CHURCH.name} 홈에서 원하시는 정보를 다시 찾아보세요.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-navy px-5 py-2.5 text-sm font-medium text-white transition hover:bg-secondary-sky"
          >
            <ArrowLeft className="size-4" aria-hidden />
            홈으로 돌아가기
          </Link>
          <Link
            href="/notices"
            className="inline-flex items-center justify-center rounded-lg bg-soft px-5 py-2.5 text-sm font-medium text-charcoal ring-1 ring-black/5 transition hover:bg-warm-gray/10"
          >
            공지사항 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
