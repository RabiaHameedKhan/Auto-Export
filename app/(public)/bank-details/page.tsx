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
        <div className="mt-10 rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] p-8">
          <p className="text-[#6b7280]">
            Bank payment instructions will appear here once configured in Admin → Settings.
          </p>
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
