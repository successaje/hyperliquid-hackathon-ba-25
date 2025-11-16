"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRealtime } from "../hooks/useRealtime";
import { useExplorerStore } from "../lib/store";
import { BlockList } from "../components/blocks/BlockList";
import { TxList } from "../components/txs/TxList";
import { StatCards } from "../components/StatCards";

export default function DashboardPage() {
  const { start, stop } = useRealtime();
  const { latestBlocks, latestTxs } = useExplorerStore();

  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <StatCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3">Latest Blocks</h2>
            <BlockList blocks={latestBlocks} />
          </div>
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-3">Latest Transactions</h2>
            <TxList txs={latestTxs} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


