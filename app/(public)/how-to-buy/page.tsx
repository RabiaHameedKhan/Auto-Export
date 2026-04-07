import { getSiteSetting } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

const defaultSteps = [
  {
    title: "We are a Trusted Name in Auto Industry",
    body: "9 Yard Trading is a leading and the most trusted name in the field of automobile trading industry.",
  },
  {
    title: "Visited by Million of Car Buyers Every Month!",
    body: "We are best known for providing quality vehicle inspection via thorough examination of every vehicle that is booked from our end.",
  },
  {
    title: "World Wide Dealing",
    body: "Our customers are in 120+ countries and rely on us for dependable vehicle sourcing.",
  },
  {
    title: "Trusted by Auto Buyers",
    body: "500+ units are sold with customer-focused service from inquiry to delivery.",
  },
  {
    title: "Affordable Auto Prices",
    body: "9 Yard Trading is the right choice to buy a car.",
  },
];

export default async function HowToBuyPage() {
  let rich: string | null = null;
  try {
    rich = await getSiteSetting("page_how_to_buy");
  } catch {
    rich = null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0a0a0a]">How to buy</h1>
      <p className="mt-4 text-lg text-[#6b7280]">
        We are a trusted name in auto industry and deliver dependable service at reasonable prices.
      </p>

      {rich ? (
        <div
          className="prose mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: rich }}
        />
      ) : (
        <ol className="mt-12 space-y-8">
          {defaultSteps.map((s, i) => (
            <li key={s.title} className="flex gap-6">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0c47a5] text-lg font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl font-semibold text-[#0a0a0a]">{s.title}</h2>
                <p className="mt-2 text-[#6b7280]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
