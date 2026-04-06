import Image from "next/image";
import Link from "next/link";
import { SITE_CONTACT } from "@/lib/site-contact";

type Props = {
  companyName?: string;
  address?: string;
  email?: string;
  phone?: string;
};

export function Footer({
  companyName = "9 Yard Trading",
  address,
  email = SITE_CONTACT.email,
  phone = SITE_CONTACT.phone,
}: Props) {
  return (
    <footer className="border-t border-[#e0e0e0] bg-[#f5f5f5]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2 font-semibold text-[#0c47a5]">
            <Image
              src="/logo.png"
              alt={`${companyName} logo`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg bg-white p-1 object-contain shadow-sm"
            />
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
            <li>
              <Link href="/search" className="hover:text-[#0c47a5]">
                Browse inventory
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-[#0c47a5]">
                Used cars
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">By Price</h3>
          <ul className="space-y-2 text-sm text-[#6b7280]">
            <li>
              <Link href="/price-under/8000" className="hover:text-[#0c47a5]">
                Under $8k
              </Link>
            </li>
            <li>
              <Link href="/by-price/8000/12000" className="hover:text-[#0c47a5]">
                $8k - $12k
              </Link>
            </li>
            <li>
              <Link href="/price-over/20000" className="hover:text-[#0c47a5]">
                Over $20k
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-[#0a0a0a]">Follow</h3>
          <div className="flex gap-3">
            <a href="#" className="text-[#0c47a5] hover:underline" aria-label="Facebook">
              Facebook
            </a>
            <a href="#" className="text-[#0c47a5] hover:underline" aria-label="YouTube">
              YouTube
            </a>
            <a href="#" className="text-[#0c47a5] hover:underline" aria-label="Instagram">
              Instagram
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
