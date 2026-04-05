"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function ListingPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const sp = useSearchParams();

  const href = (p: number) => {
    const next = new URLSearchParams(sp.toString());
    next.set("page", String(p));
    return `?${next.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="rounded-lg border border-[#e0e0e0] px-4 py-2 text-sm hover:bg-[#f5f5f5]"
        >
          Previous
        </Link>
      ) : null}
      <span className="text-sm text-[#6b7280]">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className="rounded-lg border border-[#e0e0e0] px-4 py-2 text-sm hover:bg-[#f5f5f5]"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
