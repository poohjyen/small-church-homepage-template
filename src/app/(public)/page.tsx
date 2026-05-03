import { HomeDesktop } from "@/components/home/HomeDesktop";
import { HomeMobile } from "@/components/home/HomeMobile";
import { getLandingData } from "@/lib/data/landing";

export default async function HomePage() {
  const data = await getLandingData();
  return (
    <>
      <div className="hidden md:block">
        <HomeDesktop data={data} />
      </div>
      <div className="md:hidden">
        <HomeMobile data={data} />
      </div>
    </>
  );
}
