import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/home/AnnouncementBanner";
import { getActiveAnnouncements } from "@/lib/queries/site";
import { getVehicleSidebarData } from "@/lib/queries/vehicles";
import { getSiteSettings } from "@/lib/queries/site";
import { SITE_CONTACT } from "@/lib/site-contact";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcements: { id: number; title: string | null; content: string }[] = [];
  let settings: Record<string, string | null> = {};
  let inventoryNav: Awaited<ReturnType<typeof getVehicleSidebarData>>["makes"] = [];
  let inventoryBodyTypes: Awaited<ReturnType<typeof getVehicleSidebarData>>["bodyTypes"] = [];
  let inventoryFuelTypes: Awaited<ReturnType<typeof getVehicleSidebarData>>["fuelTypes"] = [];
  let inventoryTransmissions: Awaited<ReturnType<typeof getVehicleSidebarData>>["transmissions"] = [];
  let inventorySteering: Awaited<ReturnType<typeof getVehicleSidebarData>>["steering"] = [];
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
    const sidebarData = await getVehicleSidebarData({}, { page: 1 });
    inventoryNav = sidebarData.makes;
    inventoryBodyTypes = sidebarData.bodyTypes;
    inventoryFuelTypes = sidebarData.fuelTypes;
    inventoryTransmissions = sidebarData.transmissions;
    inventorySteering = sidebarData.steering;
  } catch {
    /* DB not configured */
  }

  const companyName = settings.company_name ?? "9 Yard Trading";
  const address = settings.address ?? SITE_CONTACT.address;
  const email = SITE_CONTACT.email;
  const phone = SITE_CONTACT.phone;
  const whatsapp = SITE_CONTACT.whatsapp;

  return (
    <>
      <TopBar hours={SITE_CONTACT.hours} phone={phone} email={email} />
      <Navbar
        companyName={companyName}
        phone={phone}
        whatsapp={whatsapp}
        topMakes={inventoryNav}
        bodyTypes={inventoryBodyTypes}
        fuelTypes={inventoryFuelTypes}
        transmissions={inventoryTransmissions}
        steering={inventorySteering}
      />
      <AnnouncementBanner items={announcements} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer
        companyName={companyName}
        address={address}
        email={email}
        phone={phone}
        topMakes={inventoryNav}
        bodyTypes={inventoryBodyTypes}
      />
    </>
  );
}
