import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { priceFilterLinks, quickFilterLinks } from "@/lib/inventory-links";
import type { SidebarFacetItem } from "@/lib/queries/vehicles";

function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-[#d7dfef] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="bg-[linear-gradient(135deg,#102a66_0%,#0c47a5_100%)] px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-white">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function SidebarStatCard({
  href,
  label,
  value,
  active,
}: {
  href: string;
  label: string;
  value: number;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border px-3 py-3 transition-colors",
        active
          ? "border-[#0c47a5] bg-[#eef5ff]"
          : "border-[#dbe3f2] bg-[#f8fbff] hover:border-[#0c47a5]"
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#64748b]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#111827]">{value}</p>
    </Link>
  );
}

function FilterLink({
  href,
  label,
  count,
  active,
  imageUrl,
}: {
  href: string;
  label: string;
  count: number;
  active?: boolean;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 border px-3 py-3 transition-colors",
        active
          ? "border-[#0c47a5] bg-[#eef5ff] text-[#0c47a5]"
          : "border-[#e2e8f0] bg-white hover:border-[#0c47a5] hover:bg-[#f8fbff]"
      )}
    >
      {imageUrl ? (
        <div className="relative h-11 w-14 overflow-hidden bg-[#f8fafc]">
          <Image src={imageUrl} alt={label} fill className="object-contain p-2" sizes="56px" />
        </div>
      ) : (
        <div className="flex h-11 w-11 items-center justify-center bg-[#eaf2ff] text-xs font-bold uppercase tracking-[0.18em] text-[#0c47a5]">
          {label.slice(0, 2)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#111827]">{label}</p>
        <p className="text-xs text-[#64748b]">{count} vehicles</p>
      </div>
    </Link>
  );
}

function CompactFilterList({
  title,
  items,
  activeValue,
  buildHref,
}: {
  title: string;
  items: SidebarFacetItem[];
  activeValue?: string | number | null;
  buildHref: (item: SidebarFacetItem) => string;
}) {
  if (!items.length) return null;

  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#64748b]">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={`${title}-${item.id}`}
            href={buildHref(item)}
            className={cn(
              "flex items-center justify-between border px-3 py-2 text-sm transition-colors",
              activeValue === item.id || activeValue === item.label
                ? "border-[#0c47a5] bg-[#eef5ff] text-[#0c47a5]"
                : "border-[#e2e8f0] bg-white text-[#111827] hover:border-[#0c47a5]"
            )}
          >
            <span className="truncate font-medium">{item.label}</span>
            <span className="ml-3 bg-[#f1f5f9] px-2 py-0.5 text-xs text-[#475569]">
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SimpleLinkGrid({
  items,
  activeHref,
}: {
  items: readonly { label: string; href: string }[];
  activeHref?: string;
}) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "border px-3 py-2 text-sm font-medium transition-colors",
            activeHref === item.href
              ? "border-[#0c47a5] bg-[#eef5ff] text-[#0c47a5]"
              : "border-[#d8dee9] text-[#111827] hover:border-[#173574] hover:bg-[#eef4ff] hover:text-[#173574]"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

type InventorySidebarProps = {
  stats?: Array<{ href: string; label: string; value: number; active?: boolean }>;
  resetHref?: string;
  makes: SidebarFacetItem[];
  bodyTypes: SidebarFacetItem[];
  fuelTypes?: SidebarFacetItem[];
  transmissions?: SidebarFacetItem[];
  steering?: SidebarFacetItem[];
  makeHref: (item: SidebarFacetItem) => string;
  bodyTypeHref: (item: SidebarFacetItem) => string;
  fuelHref?: (item: SidebarFacetItem) => string;
  transmissionHref?: (item: SidebarFacetItem) => string;
  steeringHref?: (item: SidebarFacetItem) => string;
  activeMakeId?: number | null;
  activeBodyTypeId?: number | null;
  activeFuel?: string | null;
  activeTransmission?: string | null;
  activeSteering?: string | null;
  activeQuickHref?: string;
  activePriceHref?: string;
  showSpecs?: boolean;
  className?: string;
};

export function InventorySidebar({
  stats = [],
  resetHref,
  makes,
  bodyTypes,
  fuelTypes = [],
  transmissions = [],
  steering = [],
  makeHref,
  bodyTypeHref,
  fuelHref,
  transmissionHref,
  steeringHref,
  activeMakeId,
  activeBodyTypeId,
  activeFuel,
  activeTransmission,
  activeSteering,
  activeQuickHref,
  activePriceHref,
  showSpecs = true,
  className,
}: InventorySidebarProps) {
  return (
    <aside className={cn("space-y-6", className)}>
      {stats.length ? (
        <SidebarPanel title="Inventory Filters">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {stats.map((stat) => (
              <SidebarStatCard
                key={`${stat.label}-${stat.href}`}
                href={stat.href}
                label={stat.label}
                value={stat.value}
                active={stat.active}
              />
            ))}
          </div>
          {resetHref ? (
            <Link
              href={resetHref}
              className="mt-4 inline-flex text-sm font-semibold text-[#0c47a5] hover:underline"
            >
              Reset filters
            </Link>
          ) : null}
        </SidebarPanel>
      ) : null}

      <SidebarPanel title="Top Makes">
        <div className="space-y-3">
          {makes.map((item) => (
            <FilterLink
              key={`make-${item.id}`}
              href={makeHref(item)}
              label={item.label}
              count={item.count}
              active={activeMakeId === Number(item.id)}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </SidebarPanel>

      <SidebarPanel title="Body Types">
        <CompactFilterList
          title="Browse by shape"
          items={bodyTypes}
          activeValue={activeBodyTypeId}
          buildHref={bodyTypeHref}
        />
      </SidebarPanel>

      <SidebarPanel title="Price Range">
        <SimpleLinkGrid items={priceFilterLinks} activeHref={activePriceHref} />
      </SidebarPanel>

      <SidebarPanel title="Quick Filters">
        <SimpleLinkGrid items={quickFilterLinks} activeHref={activeQuickHref} />
      </SidebarPanel>

      {showSpecs && (fuelTypes.length || transmissions.length || steering.length) ? (
        <SidebarPanel title="Specifications">
          <div className="space-y-6">
            {fuelHref ? (
              <CompactFilterList
                title="Fuel type"
                items={fuelTypes}
                activeValue={activeFuel}
                buildHref={fuelHref}
              />
            ) : null}
            {transmissionHref ? (
              <CompactFilterList
                title="Transmission"
                items={transmissions}
                activeValue={activeTransmission}
                buildHref={transmissionHref}
              />
            ) : null}
            {steeringHref ? (
              <CompactFilterList
                title="Steering"
                items={steering}
                activeValue={activeSteering}
                buildHref={steeringHref}
              />
            ) : null}
          </div>
        </SidebarPanel>
      ) : null}
    </aside>
  );
}
