"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b border-white/5 bg-background/60">
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
          <span className="text-xs text-white/50 hidden sm:block">
            Powered by Lava RPC
          </span>
        </motion.div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


