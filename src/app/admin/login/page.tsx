import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { CHURCH } from "../../../../church.config";

export const metadata = { title: "관리자 로그인" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-soft px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-xs font-medium uppercase tracking-widest text-warm-gray hover:text-primary-navy"
          >
            ← {CHURCH.name} 홈으로
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-charcoal">
            {CHURCH.name} 관리자
          </h1>
          <p className="mt-2 text-sm text-warm-gray">
            등록된 관리자 계정으로 로그인해 주세요.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 md:p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-xs text-warm-gray">
          비밀번호 분실 시 사이트 관리자에게 문의해 주세요.
        </p>
      </div>
    </main>
  );
}
