"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = q.trim();
      if (!query) return;
      // Simple heuristic: hashes usually start with 0x and are longer
      if (query.startsWith("0x") && query.length > 20) {
        router.push(`/tx/${query}`);
      } else {
        router.push(`/address/${query}`);
      }
    },
    [q, router]
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/5 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <Link href="/" className="font-semibold">
            HyperScan
          </Link>
          <span className="text-xs text-foreground hidden sm:block opacity-60">
            Powered by Lava RPC
          </span>
          <nav className="hidden md:flex items-center gap-4 ml-4 text-sm">
            <Link href="/" className="text-foreground opacity-80 hover:opacity-100">Dashboard</Link>
            <Link href="/blocks" className="text-foreground opacity-80 hover:opacity-100">Blocks</Link>
            <Link href="/txs" className="text-foreground opacity-80 hover:opacity-100">Transactions</Link>
            <Link href="/whales" className="text-foreground opacity-80 hover:opacity-100">Whales</Link>
          </nav>
        </motion.div>
        <div className="flex items-center gap-3">
          <form onSubmit={onSearch} className="hidden sm:flex items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tx hash or address"
              className="px-3 py-1.5 rounded-l-lg border bg-transparent text-sm outline-none text-foreground border-black/10 dark:border-white/10 focus:border-black/20 dark:focus:border-white/20"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-r-lg border border-l-0 text-sm border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            >
              Go
            </button>
          </form>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


