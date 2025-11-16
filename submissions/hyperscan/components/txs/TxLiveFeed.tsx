"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useExplorerStore } from "../../lib/store";
import Link from "next/link";

export function TxLiveFeed() {
  const { latestTxs } = useExplorerStore();
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {latestTxs.slice(0, 20).map((t) => (
          <motion.div
            key={t.hash}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between text-sm border border-white/10 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-60">{t.type ?? "tx"}</span>
              <Link href={`/tx/${t.hash}`} className="font-mono text-xs opacity-80 hover:opacity-100">
                {t.hash.slice(0, 10)}…
              </Link>
            </div>
            <div className="text-xs opacity-60">{new Date(t.timestamp).toLocaleTimeString()}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


