import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SubNav } from "@/components/layout/SubNav";
import { SitePopupRenderer } from "@/components/SitePopupRenderer";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { EditModeProvider } from "@/components/edit-mode/EditModeContext";
import { EditModeToggle } from "@/components/edit-mode/EditModeToggle";
import { getIsAdmin } from "@/lib/auth/is-admin";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getIsAdmin();

  return (
    <EditModeProvider isAdmin={isAdmin}>
      <Header />
      <SubNav />
      <main className="min-h-screen flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <SitePopupRenderer />
      <PageViewTracker />
      <EditModeToggle />
    </EditModeProvider>
  );
}
