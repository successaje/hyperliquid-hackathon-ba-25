"use client";

import { useExplorerStore } from "../../lib/store";
import { TxList } from "../../components/txs/TxList";
import { useEffect } from "react";
import { useRealtime } from "../../hooks/useRealtime";

export default function TxsPage() {
  const { latestTxs, pendingTxs } = useExplorerStore();
  const { start, stop } = useRealtime();
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Pending</h2>
        <TxList txs={pendingTxs} />
      </div>
      <div className="card p-4">
        <TxList txs={latestTxs} />
      </div>
    </div>
  );
}


