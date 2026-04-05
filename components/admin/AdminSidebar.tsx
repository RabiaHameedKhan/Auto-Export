import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/makes", label: "Makes" },
  { href: "/admin/models", label: "Models" },
  { href: "/admin/body-types", label: "Body types" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-[#e0e0e0] bg-[#0c47a5] text-white">
      <div className="p-4 font-bold">Admin</div>
      <nav className="flex flex-col gap-1 p-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-lg px-3 py-2 text-sm hover:bg-white/10"
          >
            {l.label}
          </Link>
        ))}
        <Link href="/" className="mt-6 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10">
          ← View site
        </Link>
      </nav>
    </aside>
  );
}
