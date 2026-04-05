"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
  destinationPort: z.string().optional(),
  message: z.string().optional(),
});

type Form = z.infer<typeof schema>;

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
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
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
    } else setStatus("err");
  };

  return (
    <form
      id="quote"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-[#e0e0e0] bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-[#0a0a0a]">Get a quote</h3>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">Name *</label>
        <input
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("name")}
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("email")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">Phone</label>
        <input
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("phone")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">Country</label>
        <input
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("country")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">
          Destination port
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("destinationPort")}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#6b7280]">Message</label>
        <textarea
          rows={3}
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          {...register("message")}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#0c47a5] py-3 font-semibold text-white hover:bg-[#0a3d91] disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send inquiry"}
      </button>
      {status === "ok" ? (
        <p className="text-sm text-green-700">Thank you — we will contact you shortly.</p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      ) : null}
      {whatsapp ? (
        <a
          href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg border-2 border-[#0c47a5] py-3 text-center font-semibold text-[#0c47a5] hover:bg-[#0c47a5] hover:text-white"
        >
          WhatsApp
        </a>
      ) : null}
    </form>
  );
}
