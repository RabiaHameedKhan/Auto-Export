"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-[#e0e0e0] bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-[#0c47a5]">Admin sign in</h1>
        <p className="mt-2 text-sm text-[#6b7280]">Credentials only — keep this URL private.</p>
        <label className="mt-6 block text-sm font-medium text-[#374151]">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="mt-4 block text-sm font-medium text-[#374151]">Password</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-[#e0e0e0] px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-[#0c47a5] py-3 font-semibold text-white hover:bg-[#0a3d91] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
