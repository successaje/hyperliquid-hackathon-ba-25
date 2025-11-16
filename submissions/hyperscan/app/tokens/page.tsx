"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { LineChart } from "../../components/charts/LineChart";
import { Skeleton } from "../../components/skeleton/Skeleton";

export default function TokensPage() {
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState<Array<{ symbol: string; price: number; change24h: number; volume24h: number }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      // TODO: replace with real endpoint once available
      const demo = [
        { symbol: "HYPE", price: 1.2345, change24h: +4.2, volume24h: 125000 },
        { symbol: "USDC", price: 1.0, change24h: +0.0, volume24h: 98000 },
        { symbol: "ETH", price: 3275.12, change24h: -1.3, volume24h: 210000 },
        { symbol: "HVMLP", price: 12.34, change24h: +2.1, volume24h: 56000 },
        { symbol: "HCORE", price: 0.754, change24h: +0.6, volume24h: 32000 },
        { symbol: "HVX", price: 0.0432, change24h: -0.9, volume24h: 15000 },
      ];
      if (alive) setTokens(demo);
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const series = useMemo(
    () => tokens.map(() => Array.from({ length: 24 }).map((_, i) => ({ t: i, v: Math.random() * 100 }))),
    [tokens]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Top Tokens</h1>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-4">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-16 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))
          : tokens.map((t, idx) => (
              <div key={t.symbol} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm opacity-80">{t.symbol}</div>
                  <div className={`text-sm ${t.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {t.change24h >= 0 ? "+" : ""}
                    {t.change24h.toFixed(2)}%
                  </div>
                </div>
                <div className="text-xl font-semibold">${t.price.toFixed(4)}</div>
                <div className="text-xs opacity-60 mb-2">Vol 24h: {t.volume24h.toLocaleString()}</div>
                <LineChart series={series[idx]} color={t.change24h >= 0 ? "#34d399" : "#f43f5e"} />
              </div>
            ))}
      </motion.div>
    </div>
  );
}


