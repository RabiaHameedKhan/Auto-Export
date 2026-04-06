"use client";

import { SITE_CONTACT } from "@/lib/site-contact";

type TopBarProps = {
  hours?: string;
  phone?: string;
  email?: string;
};

export function TopBar({
  hours = SITE_CONTACT.hours,
  phone = SITE_CONTACT.phone,
  email = SITE_CONTACT.email,
}: TopBarProps) {
  return (
    <div className="bg-[#0a0a0a] text-sm text-white">
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
