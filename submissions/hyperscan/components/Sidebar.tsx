"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/txs", label: "Live Transactions" },
  { href: "/blocks", label: "Blocks" },
  { href: "/tokens", label: "Tokens" },
  { href: "/contracts", label: "Contracts" },
  { href: "/markets", label: "Markets & Pairs" },
  { href: "/account", label: "Account Analysis" },
  { href: "/metrics", label: "Network Metrics" },
  { href: "/security", label: "Security & Health" },
  { href: "/playground", label: "API Playground" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  return (
    <aside className={`border-r border-white/10 ${open ? "w-60" : "w-14"} transition-all duration-200 hidden md:block`}>
      <div className="h-14 flex items-center justify-between px-3">
        <button
          className="text-xs px-2 py-1 rounded border border-white/10 hover:border-white/20"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>
      <nav className="px-2 pb-4 space-y-1">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <motion.div
              key={it.href}
              whileHover={{ scale: 1.02 }}
              className={`rounded-lg ${active ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <Link href={it.href} className="block px-3 py-2 text-sm">
                {open ? it.label : it.label[0]}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}


