"use client";

import { motion } from "framer-motion";

export default function TokensPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Top Tokens</h1>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4 h-28">Token card #{i + 1}</div>
        ))}
      </motion.div>
    </div>
  );
}


