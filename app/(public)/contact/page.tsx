import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let s: Record<string, string | null> = {};
  try {
    s = await getSiteSettings(["address", "email", "phone", "whatsapp"]);
  } catch {
    s = {};
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0a0a0a]">Contact</h1>
      <p className="mt-4 text-[#6b7280]">
        Reach our export team by phone, email, or WhatsApp.
      </p>
      <ul className="mt-10 space-y-4 text-lg">
        {s.phone ? (
          <li>
            Phone:{" "}
            <a href={`tel:${s.phone}`} className="font-semibold text-[#0c47a5] hover:underline">
              {s.phone}
            </a>
          </li>
        ) : null}
        {s.email ? (
          <li>
            Email:{" "}
            <a href={`mailto:${s.email}`} className="font-semibold text-[#0c47a5] hover:underline">
              {s.email}
            </a>
          </li>
        ) : null}
        {s.whatsapp ? (
          <li>
            WhatsApp:{" "}
            <a
              href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0c47a5] hover:underline"
            >
              Chat now
            </a>
          </li>
        ) : null}
        {s.address ? <li className="text-[#6b7280]">{s.address}</li> : null}
      </ul>
    </div>
  );
}
