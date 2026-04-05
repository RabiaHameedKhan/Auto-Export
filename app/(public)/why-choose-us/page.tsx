import { getSiteSetting } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

const blocks = [
  {
    title: "Global export experience",
    body: "We ship to dealers and private buyers worldwide with clear documentation.",
  },
  {
    title: "Inspected stock",
    body: "Vehicles are checked and described accurately before listing.",
  },
  {
    title: "Transparent pricing",
    body: "No hidden fees — you know the vehicle price and shipping options up front.",
  },
  {
    title: "Responsive support",
    body: "Reach us by email, phone, or WhatsApp throughout the process.",
  },
];

export default async function WhyChooseUsPage() {
  let rich: string | null = null;
  try {
    rich = await getSiteSetting("page_why_choose_us");
  } catch {
    rich = null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0a0a0a]">Why choose us</h1>
      {rich ? (
        <div
          className="prose mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: rich }}
        />
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {blocks.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-[#e0e0e0] bg-white p-8 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#0c47a5]">{b.title}</h2>
              <p className="mt-3 text-[#6b7280]">{b.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
