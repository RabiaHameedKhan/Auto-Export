"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quoteFormSchema,
  type InquiryFormData,
  type QuoteFormData,
} from "@/lib/validation/inquiry";

export function QuoteForm({
  vehicleId,
  whatsapp,
}: {
  vehicleId?: number;
  whatsapp?: string;
}) {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      destinationPort: "",
      message: "",
      address: "",
    },
  });

  const fieldClassName = useMemo(
    () =>
      "mt-1 w-full rounded-xl border border-[#dbe3f2] bg-[#fbfdff] px-3 py-2.5 outline-none transition focus:border-[#0c47a5] focus:ring-2 focus:ring-[#0c47a5]/10",
    []
  );

  const onSubmit = async (data: QuoteFormData) => {
    setStatus("idle");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        vehicleId: vehicleId ?? null,
        email: data.email || undefined,
      }),
    });

    if (res.ok) {
      setStatus("ok");
      reset();
    } else {
      if (res.status === 400) {
        const payload = (await res.json().catch(() => null)) as
          | {
              error?: {
                fieldErrors?: Partial<Record<keyof InquiryFormData, string[]>>;
              };
            }
          | null;

        const fieldErrors = payload?.error?.fieldErrors;
        if (fieldErrors) {
          for (const [field, messages] of Object.entries(fieldErrors)) {
            if (field === "vehicleId" || !messages?.[0]) continue;
            setError(field as keyof QuoteFormData, {
              type: "server",
              message: messages[0],
            });
          }
        }
      }
      setStatus("err");
    }
  };

  return (
    <form
      id="quote"
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-full overflow-hidden rounded-2xl border border-[#dbe3f2] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col"
    >
      <div className="border-b border-[#e6edf7] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] px-6 py-5">
        <h3 className="text-lg font-semibold text-[#0a0a0a]">Get a quote</h3>
        <p className="mt-1 text-sm text-[#64748b]">
          Share your details and destination port for a faster response.
        </p>
      </div>

      <div className="space-y-4 px-5 py-5 sm:px-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain lg:pr-4">
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Name *</label>
          <input className={fieldClassName} {...register("name")} />
          {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Email</label>
          <input type="email" className={fieldClassName} {...register("email")} />
          {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Phone</label>
          <input className={fieldClassName} {...register("phone")} />
          {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Country</label>
          <input className={fieldClassName} {...register("country")} />
          {errors.country ? (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Destination port</label>
          <input className={fieldClassName} {...register("destinationPort")} />
          {errors.destinationPort ? (
            <p className="mt-1 text-sm text-red-600">{errors.destinationPort.message}</p>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Address</label>
          <textarea rows={4} className={fieldClassName} {...register("address")} />
          {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address.message}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#6b7280]">Message</label>
          <textarea rows={4} className={fieldClassName} {...register("message")} />
          {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message.message}</p> : null}
        </div>
      </div>

      <div className="border-t border-[#e6edf7] px-5 py-5 sm:px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#0c47a5] py-3 font-semibold text-white transition hover:bg-[#0a3d91] disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send inquiry"}
        </button>
        {status === "ok" ? (
          <p className="mt-3 text-sm text-green-700">Thank you - we will contact you shortly.</p>
        ) : null}
        {status === "err" ? (
          <p className="mt-3 text-sm text-red-600">Something went wrong. Please try again.</p>
        ) : null}
        {whatsapp ? (
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full rounded-xl border-2 border-[#0c47a5] py-3 text-center font-semibold text-[#0c47a5] transition hover:bg-[#0c47a5] hover:text-white"
          >
            WhatsApp
          </a>
        ) : null}
      </div>
    </form>
  );
}
