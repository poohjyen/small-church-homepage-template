import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubNav } from "@/components/layout/SubNav";
import { SitePopupRenderer } from "@/components/SitePopupRenderer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SubNav />
      <main className="min-h-screen flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <SitePopupRenderer />
    </>
  );
}
