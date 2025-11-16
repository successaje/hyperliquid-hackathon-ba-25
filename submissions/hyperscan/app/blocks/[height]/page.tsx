"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import Link from "next/link";

export default function BlockDetailPage() {
  const params = useParams();
  const height = String(params?.height ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Lava.getBlockByNumber(height, true);
        if (alive) setBlock(res);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to fetch block");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [height]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Block #{height}</h1>
      <div className="card p-4">
        {loading && <div className="text-sm opacity-60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && block && (
          <div className="space-y-2 text-sm">
            <div>Hash: <span className="font-mono opacity-80">{block.hash ?? block.blockHash}</span></div>
            <div>Parent: <span className="font-mono opacity-80">{block.parentHash}</span></div>
            <div>Timestamp: <span className="opacity-80">{Number(block.timestamp)}</span></div>
            <div>Tx Count: <span className="opacity-80">{Array.isArray(block.transactions) ? block.transactions.length : 0}</span></div>
          </div>
        )}
      </div>
      {!loading && !error && Array.isArray(block?.transactions) && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">Transactions</h2>
          <ul className="divide-y divide-white/5">
            {block.transactions.map((t: any) => {
              const hash = typeof t === "string" ? t : t?.hash;
              if (!hash) return null;
              return (
                <li key={hash} className="py-2 text-sm flex items-center justify-between">
                  <span className="font-mono opacity-80">{hash.slice(0, 14)}…</span>
                  <Link href={`/tx/${hash}`} className="underline underline-offset-2">View</Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Raw</h2>
        <pre className="text-xs overflow-auto">{JSON.stringify(block, null, 2)}</pre>
      </div>
    </div>
  );
}


