import { HomeDesktop } from "@/components/home/HomeDesktop";
import { HomeMobile } from "@/components/home/HomeMobile";
import { getLandingData } from "@/lib/data/landing";
import { getIsAdmin } from "@/lib/auth/is-admin";

export default async function HomePage() {
  const [data, isAdmin] = await Promise.all([getLandingData(), getIsAdmin()]);
  return (
    <>
      <div className="hidden md:block">
        <HomeDesktop data={data} isAdmin={isAdmin} />
      </div>
      <div className="md:hidden">
        <HomeMobile data={data} isAdmin={isAdmin} />
      </div>
    </>
  );
}
