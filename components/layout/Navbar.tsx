"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
import type { SidebarFacetItem } from "@/lib/queries/vehicles";
import { SITE_CONTACT } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

type NavbarProps = {
  companyName?: string;
  phone?: string;
  whatsapp?: string;
  topMakes?: SidebarFacetItem[];
  bodyTypes?: SidebarFacetItem[];
  fuelTypes?: SidebarFacetItem[];
  transmissions?: SidebarFacetItem[];
  steering?: SidebarFacetItem[];
};

export function Navbar({
  companyName = "9 Yard Trading",
  phone = SITE_CONTACT.phone,
  whatsapp = SITE_CONTACT.whatsapp,
  topMakes = [],
  bodyTypes = [],
  fuelTypes = [],
  transmissions = [],
  steering = [],
}: NavbarProps) {
  const [open, setOpen] = useState<string | null>(null);
  const mega = [
    {
      title: "By Make",
      children: topMakes.map((item) => ({
        label: item.label,
        href: item.slug ? `/brand/${item.slug}` : "/search",
      })),
    },
    {
      title: "By Body Type",
      children: bodyTypes.map((item) => ({
        label: item.label,
        href: item.slug ? `/car-type/${item.slug}` : "/search",
      })),
    },
    {
      title: "By Price",
      children: [...priceFilterLinks],
    },
    {
      title: "Quick Filters",
      children: [...quickFilterLinks],
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#e0e0e0] bg-[#0c47a5] text-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center font-semibold tracking-tight">
          <span className="flex h-14 w-[210px] items-center justify-center rounded-2xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/10 sm:h-16 sm:w-[250px]">
            <Image
              src="/logo.png"
              alt={`${companyName} logo`}
              width={250}
              height={58}
              className="h-full w-full object-contain"
              priority
            />
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setOpen("used")}
            onMouseLeave={() => setOpen(null)}
          >
            <button
              type="button"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10",
                open === "used" && "bg-white/10"
              )}
            >
              Used Cars
            </button>
            {open === "used" && (
              <div className="absolute left-0 top-full z-50 mt-1 grid min-w-[760px] grid-cols-4 gap-6 rounded-xl border border-[#e0e0e0] bg-white p-6 text-[#0a0a0a] shadow-xl">
                {mega.map((col) => (
                  <div key={col.title} className="min-w-[140px]">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                      {col.title}
                    </div>
                    <ul className="space-y-1">
                      {col.children.map((item) => (
                        <li key={`${col.title}-${item.href}`}>
                          <Link href={item.href} className="text-sm hover:text-[#0c47a5]">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/brand-new"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
          >
            Brand New
          </Link>
          <Link
            href="/why-choose-us"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
          >
            Why Choose Us
          </Link>
          <Link
            href="/how-to-buy"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
          >
            How to Buy
          </Link>
          <Link
            href="/bank-details"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
          >
            Bank Details
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-sm opacity-90">{phone}</span>
        </div>

        <MobileMenu
          companyName={companyName}
          phone={phone}
          whatsapp={whatsapp}
          topMakes={topMakes}
          bodyTypes={bodyTypes}
          fuelTypes={fuelTypes}
          transmissions={transmissions}
          steering={steering}
        />
      </nav>
    </header>
  );
}
