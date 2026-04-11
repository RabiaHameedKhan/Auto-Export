export const priceFilterLinks = [
  { label: "Under $8k", href: "/price-under/8000" },
  { label: "$8k - $12k", href: "/by-price/8000/12000" },
  { label: "$12k - $20k", href: "/by-price/12000/20000" },
  { label: "Over $20k", href: "/price-over/20000" },
] as const;

export const quickFilterLinks = [
  { label: "Petrol", href: "/search?fuel=Petrol" },
  { label: "Diesel", href: "/search?fuel=Diesel" },
  { label: "Electric", href: "/search?fuel=Electric" },
  { label: "LHD", href: "/search?steering=Left" },
  { label: "RHD", href: "/search?steering=Right" },
  { label: "Manual", href: "/search?transmission=Manual" },
  { label: "Automatic", href: "/search?transmission=Automatic" },
] as const;
