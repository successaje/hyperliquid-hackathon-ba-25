"use client";

import { useExplorerStore } from "../lib/store";

export function StatCards() {
  const { latestBlocks, latestTxs } = useExplorerStore();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-4">
        <div className="text-sm text-white/60">Blocks (last 30)</div>
        <div className="text-2xl font-semibold">{latestBlocks.length}</div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-white/60">Txs (last 50)</div>
        <div className="text-2xl font-semibold">{latestTxs.length}</div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-white/60">Avg Tx/Block</div>
        <div className="text-2xl font-semibold">
          {latestBlocks.length
            ? Math.round(
                (latestTxs.length / Math.max(1, latestBlocks.length)) * 10
              ) / 10
            : 0}
        </div>
      </div>
      <div className="card p-4">
        <div className="text-sm text-white/60">Realtime</div>
        <div className="text-2xl font-semibold">On</div>
      </div>
    </div>
  );
}


