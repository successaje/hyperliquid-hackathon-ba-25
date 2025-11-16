"use client";

import { useState } from "react";
import { useAlerts } from "../../hooks/useAlerts";

export function AlertsPanel() {
  const [threshold, setThreshold] = useState(50000);
  const { alerts } = useAlerts(threshold);

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alerts</h2>
        <label className="text-sm flex items-center gap-2">
          Threshold
          <input
            type="number"
            className="px-2 py-1 rounded border text-foreground bg-transparent border-white/10"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value || 0))}
            min={0}
            step={1000}
          />
        </label>
      </div>
      {alerts.length === 0 ? (
        <div className="text-sm text-foreground opacity-60">No alerts yet.</div>
      ) : (
        <ul className="divide-y divide-white/5">
          {alerts.map((a) => (
            <li key={a.id} className="py-2 text-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="opacity-80">Whale Transfer</span>
                <span className="text-xs opacity-60">{a.hash.slice(0, 14)}…</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">{a.amount.toLocaleString()}</div>
                <div className="text-xs opacity-60">{new Date(a.timestamp).toLocaleTimeString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


