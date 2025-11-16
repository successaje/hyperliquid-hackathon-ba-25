"use client";

import { useExplorerStore } from "../lib/store";
import { Sparkline } from "./charts/Sparkline";
import { useMemo } from "react";

export function StatCards() {
  const { latestBlocks, latestTxs, metrics } = useExplorerStore();
  const txSpark = useMemo(() => {
    const buckets = new Array(12).fill(0);
    latestTxs.slice(0, 60).forEach((_, idx) => {
      buckets[idx % buckets.length] += 1;
    });
    return buckets;
  }, [latestTxs]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20 glow">
        <div className="text-sm text-foreground opacity-60">TPS</div>
        <div className="text-2xl font-semibold">{metrics.tps ?? 0}</div>
        <Sparkline points={txSpark} color="#00E0FF" />
      </div>
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20 glow">
        <div className="text-sm text-foreground opacity-60">Pending Txs</div>
        <div className="text-2xl font-semibold">{metrics.pending ?? 0}</div>
        <Sparkline points={txSpark} color="#a78bfa" />
      </div>
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20 glow">
        <div className="text-sm text-foreground opacity-60">Latest Block</div>
        <div className="text-2xl font-semibold">{metrics.latestBlock ?? (latestBlocks[0]?.height ?? 0)}</div>
        <Sparkline points={txSpark} color="#34d399" />
      </div>
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20 glow">
        <div className="text-sm text-foreground opacity-60">Avg Gas</div>
        <div className="text-2xl font-semibold">{metrics.gasAvg ?? 0}</div>
        <Sparkline points={txSpark} color="#f59e0b" />
      </div>
    </div>
  );
}


