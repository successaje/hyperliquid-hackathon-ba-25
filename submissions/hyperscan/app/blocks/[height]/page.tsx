"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import Link from "next/link";
import { CubeIcon, CheckIcon, ClockIcon } from "../../../components/ui/Icons";
import { Badge } from "../../../components/ui/Badge";

export default function BlockDetailPage() {
  const params = useParams();
  const height = String(params?.height ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [block, setBlock] = useState<any>(null);
  const [systemTxs, setSystemTxs] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [res, sys] = await Promise.all([
          Lava.getBlockByNumber(height, true),
          Lava.getSystemTxsByBlockNumber(height).catch(() => []),
        ]);
        if (alive) {
          setBlock(res);
          setSystemTxs(Array.isArray(sys) ? sys : []);
        }
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <CubeIcon className="w-5 h-5 text-primary" />
          Block #{height}
        </h1>
        <span className="inline-flex items-center gap-1 text-green-400 text-sm">
          <CheckIcon className="w-4 h-4" /> Finalized
        </span>
      </div>
      <div className="card p-4">
        {loading && <div className="text-sm opacity-60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && block && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
              <div className="opacity-60">Hash</div>
              <div className="font-mono opacity-90 break-all">{block.hash ?? block.blockHash}</div>
            </div>
            <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
              <div className="opacity-60">Parent</div>
              <div className="font-mono opacity-90 break-all">{block.parentHash}</div>
            </div>
            <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
              <div className="opacity-60">Timestamp</div>
              <div className="opacity-90 inline-flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5 opacity-70" />
                {Number(block.timestamp)}
              </div>
            </div>
            <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
              <div className="opacity-60">Tx Count</div>
              <div className="opacity-90">{Array.isArray(block.transactions) ? block.transactions.length : 0}</div>
            </div>
            {"gasUsed" in (block || {}) && (
              <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
                <div className="opacity-60">Gas Used</div>
                <div className="opacity-90">{block.gasUsed}</div>
              </div>
            )}
            <div className="p-3 rounded border" style={{ borderColor: "var(--color-border)" }}>
              <div className="opacity-60">System Tx</div>
              <div className="opacity-90">{systemTxs.length}</div>
            </div>
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
                  <div className="flex items-center gap-2">
                    <Badge color="blue">EVM</Badge>
                    <Link href={`/tx/${hash}`} className="underline underline-offset-2">View</Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!loading && !error && systemTxs.length > 0 && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">System Transactions</h2>
          <ul className="divide-y divide-white/5">
            {systemTxs.map((s: any, i: number) => (
              <li key={i} className="py-2 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge color="purple">SYS</Badge>
                  <span className="opacity-80">{String(s?.type ?? s?.kind ?? "system")}</span>
                </div>
                <span className="opacity-60">{String(s?.id ?? i)}</span>
              </li>
            ))}
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


