import { getSiteSetting } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

const defaultSteps = [
  {
    title: "Order",
    body: "Choose your vehicle using our search filters — by make, body type, price, fuel, and more.",
  },
  {
    title: "Buy now",
    body: "Tell us your destination country and port, then submit a quote request or contact us on WhatsApp.",
  },
  {
    title: "Make payment",
    body: "Pay securely via bank wire transfer (TT) or PayPal as agreed in your proforma invoice.",
  },
  {
    title: "Shipment",
    body: "We arrange shipping and share tracking so you can follow your vehicle to the port.",
  },
  {
    title: "Customs clearance",
    body: "Complete import customs and registration at your destination port with local support.",
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
        Five simple steps from choosing your car to receiving it at your port.
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
