"use client";

import { useEffect, useState } from "react";

export function TopBar() {
  const [stats, setStats] = useState({ totalVehicles: 0, addedToday: 0 });
  const [time, setTime] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await fetch("/api/stats");
        const j = await r.json();
        if (!cancelled) setStats(j);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-[#0a0a0a] text-white text-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2">
        <div className="flex flex-wrap gap-4">
          <span>
            Total Cars:{" "}
            <strong className="text-[#e6d53c]">{stats.totalVehicles}</strong>
          </span>
          <span>
            Cars Added Today:{" "}
            <strong className="text-[#e6d53c]">{stats.addedToday}</strong>
          </span>
        </div>
        <div className="font-mono tabular-nums text-[#e6d53c]">{time}</div>
      </div>
    </div>
  );
}
