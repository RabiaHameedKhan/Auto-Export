import { getSiteSettings } from "@/lib/queries/site";
import { SITE_CONTACT } from "@/lib/site-contact";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let s: Record<string, string | null> = {};
  try {
    s = await getSiteSettings(["address", "email", "phone", "whatsapp"]);
  } catch {
    s = {};
  }

  const phone = SITE_CONTACT.phone;
  const email = SITE_CONTACT.email;
  const whatsapp = SITE_CONTACT.whatsapp;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0a0a0a]">Contact</h1>
      <p className="mt-4 text-[#6b7280]">
        Reach our export team by phone, email, or WhatsApp.
      </p>
      <p className="mt-2 text-sm font-medium text-[#0c47a5]">
        {SITE_CONTACT.hours}
      </p>
      <ul className="mt-10 space-y-4 text-lg">
        <li>
          Phone:{" "}
          <a href={`tel:${phone}`} className="font-semibold text-[#0c47a5] hover:underline">
            {phone}
          </a>
        </li>
        <li>
          Email:{" "}
          <a href={`mailto:${email}`} className="font-semibold text-[#0c47a5] hover:underline">
            {email}
          </a>
        </li>
        <li>
          WhatsApp:{" "}
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#0c47a5] hover:underline"
          >
            Chat now
          </a>
        </li>
        {s.address ? <li className="text-[#6b7280]">{s.address}</li> : null}
      </ul>
    </div>
  );
}
