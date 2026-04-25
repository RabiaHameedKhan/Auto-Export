import { getSiteSetting } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export default async function BankDetailsPage() {
  let content: string | null = null;
  let security: string | null = null;
  try {
    content = await getSiteSetting("bank_details_html");
    security = await getSiteSetting("security_notice");
  } catch {
    content = null;
    security = null;
  }

  const transferDetails = [
    ["Account Type", "US$ Dollar"],
    ["Account Title", "9 Yard Trading Company Limited"],
    ["Bank Name", "KRUNG THAI BANK PUBLIC COMPANY LIMITED"],
    ["Address", "596 Sukhumvit 63, Khlong, Wattana, Bangkok 10110"],
    ["Account No", "899000000852"],
    ["Swift Code No", "KRTHTHBK"],
    ["Branch Name", "Ekkamai Branch"],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-[#0a0a0a]">Bank details</h1>
      <p className="mt-4 text-[#6b7280]">
        Pay by telegraphic transfer (TT) to our company account. PayPal may be available on request.
      </p>

      {content ? (
        <div
          className="prose mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-[#0c47a5]/20 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(90deg,#0b2b66_0%,#0c47a5_55%,#1670d8_100%)] px-6 py-4">
            <h2 className="text-right text-xl font-bold uppercase tracking-[0.12em] text-white">
              Transfer Details
            </h2>
          </div>
          <div className="grid gap-0">
            {transferDetails.map(([label, value], index) => (
              <div
                key={label}
                className={`grid gap-2 border-t border-[#d7dfef] px-6 py-4 sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4 ${
                  index === 0 ? "border-t-0" : ""
                }`}
              >
                <p className="text-lg font-bold text-[#111827]">{label}:</p>
                <p className="text-lg font-semibold leading-8 text-[#111827]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm text-amber-950">
        <strong className="block">Security</strong>
        <p className="mt-2">
          {security ??
            "Always verify bank details through official channels. We will never ask you to send payment to a personal account or change account details by email."}
        </p>
      </div>
    </div>
  );
}
