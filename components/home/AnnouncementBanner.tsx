"use client";

import { useEffect, useState } from "react";

type Item = { id: number; title: string | null; content: string };

export function AnnouncementBanner({ items }: { items: Item[] }) {
  const [dismissed, setDismissed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("announcement-dismissed");
      if (raw) setDismissed(JSON.parse(raw) as Record<number, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  const visible = items.filter((i) => !dismissed[i.id]);
  if (visible.length === 0) return null;

  const dismiss = (id: number) => {
    const next = { ...dismissed, [id]: true };
    setDismissed(next);
    try {
      localStorage.setItem("announcement-dismissed", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-0">
      {visible.map((a) => (
        <div
          key={a.id}
          className="relative border-b border-black/10 bg-[#e6d53c] px-4 py-3 text-center text-sm text-[#0a0a0a]"
        >
          {a.title ? (
            <strong className="mr-2">{a.title}:</strong>
          ) : null}
          <span dangerouslySetInnerHTML={{ __html: a.content }} />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-black/10"
            aria-label="Dismiss"
            onClick={() => dismiss(a.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
