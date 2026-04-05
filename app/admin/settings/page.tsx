export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Site settings</h1>
      <p className="mt-4 max-w-2xl text-[#6b7280]">
        Store keys in the <code className="rounded bg-[#f5f5f5] px-1">site_settings</code> table
        (company_name, address, email, phone, whatsapp, hero_banner_url, page_how_to_buy,
        page_why_choose_us, bank_details_html, security_notice). Use SQL or extend this page
        with forms.
      </p>
    </div>
  );
}
