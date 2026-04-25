"use client";

import { SITE_CONTACT } from "@/lib/site-contact";

type TopBarProps = {
  hours?: string;
  phone?: string;
  email?: string;
};

const securityHeadline =
  "Beware of scam websites. For your safety, please ensure all payments are made only to our official bank account under the name: 9 Yard Tarding Company Limited";

export function TopBar({
  hours = SITE_CONTACT.hours,
  phone = SITE_CONTACT.phone,
  email = SITE_CONTACT.email,
}: TopBarProps) {
  return (
    <div className="bg-[#0a0a0a] text-sm text-white">
      <div className="overflow-hidden border-b border-black/10 bg-[#facc15] text-[11px] font-bold uppercase tracking-[0.14em] text-[#111827]">
        <div className="marquee-shell py-2">
          <div className="marquee-track">
            <span className="mx-8 inline-block whitespace-nowrap">{securityHeadline}</span>
            <span className="mx-8 inline-block whitespace-nowrap">{securityHeadline}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2 md:justify-between">
        <span className="text-white/85">{hours}</span>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href={`tel:${phone}`} className="font-medium text-[#e6d53c] hover:underline">
            {phone}
          </a>
          <a href={`mailto:${email}`} className="font-medium text-[#e6d53c] hover:underline">
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
