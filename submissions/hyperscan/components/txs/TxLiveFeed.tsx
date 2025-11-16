"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useExplorerStore } from "../../lib/store";
import Link from "next/link";
import { Badge } from "../ui/Badge";

export function TxLiveFeed() {
  const { latestTxs } = useExplorerStore();
  return (
    <div className="space-y-2 h-72 overflow-auto pr-1">
      <AnimatePresence initial={false} mode="popLayout">
        {latestTxs.slice(0, 20).map((t) => (
          <motion.div
            key={t.hash}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between text-sm border rounded-lg px-3 py-2"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center gap-2">
              <Badge color={t.type === "transfer" ? "green" : t.type === "pending" ? "yellow" : "blue"}>
                {t.type ?? "tx"}
              </Badge>
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


