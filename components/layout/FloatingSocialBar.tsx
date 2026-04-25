import type { ReactNode } from "react";
import { SITE_CONTACT } from "@/lib/site-contact";

type Props = {
  whatsapp?: string;
  facebook?: string;
};

function IconShell({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_14px_26px_rgba(15,23,42,0.22)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </a>
  );
}

export function FloatingSocialBar({
  whatsapp = SITE_CONTACT.whatsapp,
  facebook = SITE_CONTACT.facebook,
}: Props) {
  return (
    <>
      <div className="fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 md:hidden">
        <IconShell
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          label="Chat on WhatsApp"
          className="bg-[#16a34a]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.53 0 .23 5.3.23 11.83c0 2.08.54 4.1 1.57 5.89L0 24l6.45-1.69a11.76 11.76 0 0 0 5.61 1.43h.01c6.53 0 11.83-5.3 11.83-11.83 0-3.16-1.23-6.13-3.38-8.43ZM12.07 21.7h-.01a9.82 9.82 0 0 1-5-1.37l-.36-.21-3.83 1 1.02-3.74-.23-.39a9.78 9.78 0 0 1-1.5-5.16c0-5.43 4.42-9.85 9.87-9.85 2.63 0 5.1 1.02 6.96 2.89a9.8 9.8 0 0 1 2.88 6.96c0 5.44-4.43 9.87-9.8 9.87Zm5.41-7.35c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.15 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
          </svg>
        </IconShell>
        <IconShell href={facebook} label="Open Facebook" className="bg-[#1877f2]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.62.76-1.62 1.55V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
          </svg>
        </IconShell>
      </div>

      <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-2 md:flex">
        <IconShell
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          label="Chat on WhatsApp"
          className="bg-[#16a34a]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.53 0 .23 5.3.23 11.83c0 2.08.54 4.1 1.57 5.89L0 24l6.45-1.69a11.76 11.76 0 0 0 5.61 1.43h.01c6.53 0 11.83-5.3 11.83-11.83 0-3.16-1.23-6.13-3.38-8.43ZM12.07 21.7h-.01a9.82 9.82 0 0 1-5-1.37l-.36-.21-3.83 1 1.02-3.74-.23-.39a9.78 9.78 0 0 1-1.5-5.16c0-5.43 4.42-9.85 9.87-9.85 2.63 0 5.1 1.02 6.96 2.89a9.8 9.8 0 0 1 2.88 6.96c0 5.44-4.43 9.87-9.8 9.87Zm5.41-7.35c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.46-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.02-1.05 2.5s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.15 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
          </svg>
        </IconShell>
        <IconShell href={facebook} label="Open Facebook" className="bg-[#1877f2]">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.62.76-1.62 1.55V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
          </svg>
        </IconShell>
      </div>
    </>
  );
}
