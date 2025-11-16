"use client";

import { useEffect, useState } from "react";
import { AlertsPanel } from "../../components/alerts/AlertsPanel";

type Whale = { address: string; volume24h: number; lastSeen: string };

export default function WhalesPage() {
  const [loading, setLoading] = useState(true);
  const [whales, setWhales] = useState<Whale[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      // Placeholder: derive from tx stream later
      const now = Date.now();
      const demo: Whale[] = [
        { address: "0xwhaleA...", volume24h: 128_000, lastSeen: new Date(now - 60_000).toISOString() },
        { address: "0xwhaleB...", volume24h: 96_500, lastSeen: new Date(now - 3_600_000).toISOString() },
      ];
      if (alive) setWhales(demo);
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Whale Tracker</h1>
      <AlertsPanel />
      <div className="card p-4">
        {loading ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : whales.length ? (
          <ul className="divide-y divide-white/5">
            {whales.map((w) => (
              <li key={w.address} className="py-2 flex items-center justify-between">
                <div className="text-sm">{w.address}</div>
                <div className="text-xs text-white/70">
                  {w.volume24h.toLocaleString()} vol / {new Date(w.lastSeen).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-sm text-white/60">No whales detected.</div>
        )}
      </div>
    </div>
  );
}


