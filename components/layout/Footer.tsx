import Image from "next/image";
import Link from "next/link";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
import type { SidebarFacetItem } from "@/lib/queries/vehicles";
import { SITE_CONTACT } from "@/lib/site-contact";

type Props = {
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
  topMakes?: SidebarFacetItem[];
  bodyTypes?: SidebarFacetItem[];
};

export function Footer({
  companyName = "9 Yard Trading",
  address,
  email = SITE_CONTACT.email,
  phone = SITE_CONTACT.phone,
  topMakes = [],
  bodyTypes = [],
}: Props) {
  return (
    <footer className="border-t border-[#e0e0e0] bg-[#f5f5f5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-5">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold text-[#0c47a5]">
            <div className="flex h-16 w-28 items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
              <Image
                src="/logo.png"
                alt={`${companyName} logo`}
                width={96}
                height={48}
                className="h-full w-full object-contain"
              />
            </div>
            {companyName}
          </div>
          {address ? <p className="text-sm text-[#6b7280]">{address}</p> : null}
          <p className="mt-2 text-sm">
            <a href={`tel:${phone}`} className="text-[#0c47a5] hover:underline">
              {phone}
            </a>
          </p>
          <p className="text-sm">
            <a href={`mailto:${email}`} className="text-[#0c47a5] hover:underline">
              {email}
            </a>
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">By Make</h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            {topMakes.slice(0, 6).map((item) => (
              <li key={`footer-make-${item.id}`}>
                <Link href={item.slug ? `/brand/${item.slug}` : "/search"} className="hover:text-[#0c47a5]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">By Body Type</h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            {bodyTypes.slice(0, 6).map((item) => (
              <li key={`footer-body-${item.id}`}>
                <Link href={item.slug ? `/car-type/${item.slug}` : "/search"} className="hover:text-[#0c47a5]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">By Price</h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            {priceFilterLinks.map((item) => (
              <li key={`footer-price-${item.href}`}>
                <Link href={item.href} className="hover:text-[#0c47a5]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">Quick Filters</h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            {quickFilterLinks.map((item) => (
              <li key={`footer-quick-${item.href}`}>
                <Link href={item.href} className="hover:text-[#0c47a5]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.facebook.com/people/9yard-Trading-Thailand/100086220451987/?rdid=hPaTYrYy4w8zBWAU&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19KZMEgTEY%2F"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0c47a5] hover:underline"
              aria-label="Facebook"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e0e0e0] py-4 text-center text-xs text-[#6b7280]">
        © {new Date().getFullYear()} {companyName}. All rights reserved.
      </div>
    </footer>
  );
}
