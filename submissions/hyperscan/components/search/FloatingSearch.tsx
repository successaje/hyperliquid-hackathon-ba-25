"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const query = q.trim();
      if (!query) return;
      if (query.startsWith("0x") && query.length > 20) {
        router.push(`/tx/${query}`);
      } else {
        router.push(`/address/${query}`);
      }
      setOpen(false);
      setQ("");
    },
    [q, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        className="fixed bottom-6 right-6 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm backdrop-blur hover:border-white/20"
        onClick={() => setOpen(true)}
        title="Search (⌘/Ctrl + K)"
      >
        Search
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="mx-auto max-w-2xl mt-24 card p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search transactions, addresses, tokens, contracts…"
                  className="flex-1 px-3 py-2 rounded-lg bg-transparent border border-white/10 focus:border-white/20 outline-none"
                />
                <button className="px-3 py-2 rounded-lg border border-white/10 hover:border-white/20">
                  Go
                </button>
              </form>
              <div className="mt-2 text-xs opacity-60">Tip: Press ⌘/Ctrl + K to toggle</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


