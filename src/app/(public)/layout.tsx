import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubNav } from "@/components/layout/SubNav";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SubNav />
      <main className="min-h-screen flex-1">{children}</main>
      <Footer />
    </>
  );
}
