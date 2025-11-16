"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthButton } from "./auth/AuthButton";
import { resolveQueryToRoute } from "../lib/resolve";

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [canPrivy, setCanPrivy] = useState(false);

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    const eth: any = hasWindow ? (window as any).ethereum : null;
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    setCanPrivy(Boolean(appId) && Boolean(eth) && typeof eth?.on === "function");
  }, []);

  const onSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const query = q.trim();
      if (!query) return;
      const target = await resolveQueryToRoute(query);
      router.push(target.href);
    },
    [q, router]
  );

  return (
    <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-6"
          >
            <div className="flex items-center gap-2">
              <Link href="/" className="font-semibold text-lg leading-none">
                HyperScan
              </Link>
              <span className="hidden sm:inline-block text-xs text-foreground/60 leading-none">
                Powered by Lava RPC
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/" className="text-foreground/80 hover:text-foreground transition">Dashboard</Link>
              <Link href="/blocks" className="text-foreground/80 hover:text-foreground transition">Blocks</Link>
              <Link href="/txs" className="text-foreground/80 hover:text-foreground transition">Transactions</Link>
              <Link href="/whales" className="text-foreground/80 hover:text-foreground transition">Whales</Link>
            </nav>
          </motion.div>
          <div className="flex items-center gap-3">
            <form onSubmit={onSearch} className="hidden sm:flex items-stretch gap-0">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tx hash or address"
                className="h-9 px-3 rounded-l-md border bg-transparent text-sm outline-none text-foreground border-black/10 dark:border-white/10 focus:border-black/20 dark:focus:border-white/20 w-64"
              />
              <button
                type="submit"
                className="h-9 px-3 rounded-r-md border border-l-0 text-sm border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
              >
                Go
              </button>
            </form>
            <ThemeToggle />
            {canPrivy ? <AuthButton /> : null}
          </div>
        </div>
      </div>
    </header>
  );
}


