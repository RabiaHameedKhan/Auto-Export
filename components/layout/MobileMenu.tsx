"use client";

import Link from "next/link";
import { useState } from "react";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
import { buildVehicleSearchHref } from "@/lib/listing-params";
import type { SidebarFacetItem } from "@/lib/queries/vehicles";
import { cn } from "@/lib/utils";

type Props = {
  companyName: string;
  phone: string;
  whatsapp: string;
  topMakes?: SidebarFacetItem[];
  bodyTypes?: SidebarFacetItem[];
  fuelTypes?: SidebarFacetItem[];
  transmissions?: SidebarFacetItem[];
  steering?: SidebarFacetItem[];
};

export function MobileMenu({
  companyName,
  phone,
  whatsapp,
  topMakes = [],
  bodyTypes = [],
  fuelTypes = [],
  transmissions = [],
  steering = [],
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        className="rounded-lg p-2 hover:bg-white/10"
        onClick={() => setOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-[min(100%,340px)] flex-col bg-[#0c47a5] shadow-xl transition-transform duration-200 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <span className="font-semibold">{companyName}</span>
          <button
            type="button"
            className="rounded p-2 hover:bg-white/10"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            X
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto p-4 text-sm">
          <Link href="/search" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            Used Cars
          </Link>
          <Link href="/brand-new" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            Brand New
          </Link>
          <Link href="/why-choose-us" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            Why Choose Us
          </Link>
          <Link href="/how-to-buy" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            How to Buy
          </Link>
          <Link href="/bank-details" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            Bank Details
          </Link>
          <Link href="/contact" className="rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
            Contact
          </Link>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-2">
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Inventory Filters
            </p>
            <p className="px-3 pb-2 pt-1 text-xs text-white/65">
              Sidebar filters are available here on smaller screens.
            </p>
            <Link
              href="/search"
              className="block rounded-lg px-3 py-2 font-medium hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              View all stock
            </Link>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              By Make
            </p>
            {topMakes.map((item) => (
              <Link
                key={`mobile-make-${item.id}`}
                href={item.slug ? `/brand/${item.slug}` : "/search"}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              By Body Type
            </p>
            {bodyTypes.map((item) => (
              <Link
                key={`mobile-body-${item.id}`}
                href={item.slug ? `/car-type/${item.slug}` : "/search"}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {fuelTypes.length ? (
            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Fuel Type
              </p>
              {fuelTypes.map((item) => (
                <Link
                  key={`mobile-fuel-${item.id}`}
                  href={buildVehicleSearchHref({
                    fuel: String(item.id) === "Unknown" ? undefined : String(item.id),
                    page: 1,
                  })}
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          {transmissions.length ? (
            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Transmission
              </p>
              {transmissions.map((item) => (
                <Link
                  key={`mobile-transmission-${item.id}`}
                  href={buildVehicleSearchHref({
                    transmission: String(item.id) === "Unknown" ? undefined : String(item.id),
                    page: 1,
                  })}
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          {steering.length ? (
            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Steering
              </p>
              {steering.map((item) => (
                <Link
                  key={`mobile-steering-${item.id}`}
                  href={buildVehicleSearchHref({
                    steering: String(item.id) === "Unknown" ? undefined : String(item.id),
                    page: 1,
                  })}
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-2 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              By Price
            </p>
            {priceFilterLinks.map((item) => (
              <Link
                key={`mobile-price-${item.href}`}
                href={item.href}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 border-t border-white/10 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              Quick Filters
            </p>
            {quickFilterLinks.map((item) => (
              <Link
                key={`mobile-quick-${item.href}`}
                href={item.href}
                className="block rounded-lg px-3 py-2 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="mt-4 rounded-lg bg-[#e6d53c] px-3 py-3 text-center font-semibold text-black"
          >
            {phone}
          </a>
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/30 px-3 py-3 text-center"
          >
            WhatsApp
          </a>
        </nav>
      </aside>
    </div>
  );
}
