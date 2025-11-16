"use client";

import { useEffect, useRef, useState } from "react";
import { useExplorerStore } from "../lib/store";

export type WhaleAlert = {
  id: string;
  kind: "whale-tx";
  hash: string;
  amount: number;
  from?: string;
  to?: string;
  timestamp: string;
};

export function useAlerts(threshold: number = 50_000) {
  const { latestTxs } = useExplorerStore();
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const t of latestTxs) {
      const amt = Number((t as any).amount ?? (t as any).value ?? 0);
      if (!amt || amt < threshold) continue;
      const id = `${t.hash}`;
      if (seen.current.has(id)) continue;
      seen.current.add(id);
      setAlerts((prev) => [
        {
          id,
          kind: "whale-tx",
          hash: t.hash,
          amount: amt,
          from: (t as any).from,
          to: (t as any).to,
          timestamp: t.timestamp,
        },
        ...prev,
      ].slice(0, 50));
    }
  }, [latestTxs, threshold]);

  return { alerts };
}


