import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { getActiveAnnouncements } from "@/lib/queries/site";
import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcements: { id: number; title: string | null; content: string }[] = [];
  let settings: Record<string, string | null> = {};
  try {
    const raw = await getActiveAnnouncements();
    announcements = raw.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
    }));
    settings = await getSiteSettings([
      "company_name",
      "address",
      "email",
      "phone",
      "whatsapp",
    ]);
  } catch {
    /* DB not configured */
  }

  const companyName = settings.company_name ?? "Auto Export";
  const address = settings.address ?? undefined;
  const email = settings.email ?? undefined;
  const phone = settings.phone ?? undefined;

  return (
    <>
      <TopBar />
      <Navbar
        companyName={companyName}
        phone={phone ?? "+66 00 000 0000"}
        whatsapp={settings.whatsapp ?? "66000000000"}
      />
      <AnnouncementBanner items={announcements} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer
        companyName={companyName}
        address={address}
        email={email}
        phone={phone}
      />
    </>
  );
}
