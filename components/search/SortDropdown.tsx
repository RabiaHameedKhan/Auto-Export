"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: New to Old" },
  { value: "year_asc", label: "Year: Old to New" },
  { value: "mileage_asc", label: "Mileage: Low to High" },
  { value: "mileage_desc", label: "Mileage: High to Low" },
];

export function SortDropdown() {
  const router = useRouter();
  const sp = useSearchParams();
  const current = sp.get("sort") ?? "";

  return (
    <select
      className="rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm"
      value={current}
      onChange={(e) => {
        const next = new URLSearchParams(sp.toString());
        if (e.target.value) next.set("sort", e.target.value);
        else next.delete("sort");
        next.set("page", "1");
        router.push(`?${next.toString()}`);
      }}
    >
      {options.map((o) => (
        <option key={o.value || "default"} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
