"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

const mega = [
  {
    title: "By Make",
    href: "/search",
    children: [] as { label: string; href: string }[],
  },
  {
    title: "By Type",
    href: "/search",
    children: [
      { label: "Standard Cab", href: "/car-type/standard-cab" },
      { label: "Double Cab", href: "/car-type/double-cab" },
    ],
  },
  {
    title: "By Price",
    href: "/search",
    children: [
      { label: "Under $8k", href: "/price-under/8000" },
      { label: "$8k – $12k", href: "/by-price/8000/12000" },
      { label: "Over $20k", href: "/price-over/20000" },
    ],
  },
];

type NavbarProps = {
  companyName?: string;
  phone?: string;
  whatsapp?: string;
};

export function Navbar({
  companyName = "Auto Export",
  phone = "+66 00 000 0000",
  whatsapp = "66000000000",
}: NavbarProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e0e0e0] bg-[#0c47a5] text-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold text-[#e6d53c]">
            AE
          </span>
          <span className="hidden sm:inline">{companyName}</span>
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
              Used Cars ▾
            </button>
            {open === "used" && (
              <div className="absolute left-0 top-full z-50 mt-1 flex min-w-[520px] gap-6 rounded-xl border border-[#e0e0e0] bg-white p-6 text-[#0a0a0a] shadow-xl">
                {mega.map((col) => (
                  <div key={col.title} className="min-w-[140px]">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                      {col.title}
                    </div>
                    <ul className="space-y-1">
                      {col.children.length === 0 ? (
                        <li>
                          <Link
                            href="/search"
                            className="text-sm text-[#0c47a5] hover:underline"
                          >
                            Browse all used
                          </Link>
                        </li>
                      ) : (
                        col.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="text-sm hover:text-[#0c47a5]"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))
                      )}
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
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#e6d53c] px-3 py-2 text-sm font-semibold text-black hover:bg-[#d4c235]"
          >
            WhatsApp
          </a>
          <span className="text-sm opacity-90">{phone}</span>
        </div>

        <MobileMenu companyName={companyName} phone={phone} whatsapp={whatsapp} />
      </nav>
    </header>
  );
}
