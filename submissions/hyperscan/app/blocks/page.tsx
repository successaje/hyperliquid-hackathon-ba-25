"use client";

import { useExplorerStore } from "../../lib/store";
import { useEffect } from "react";
import { useRealtime } from "../../hooks/useRealtime";
import Link from "next/link";
import { formatDistanceToNowStrict } from "../../utils/format";
import { Badge } from "../../components/ui/Badge";
import { CubeIcon, CheckIcon, ClockIcon } from "../../components/ui/Icons";

export default function BlocksPage() {
  const { latestBlocks } = useExplorerStore();
  const { start, stop } = useRealtime();
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Blocks</h1>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <span className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border" style={{ borderColor: "var(--color-border)" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-green-400 -ml-2" />
            <span>Scanning new blocks…</span>
          </span>
        </div>
      </div>
      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-foreground opacity-60">
            <tr>
              <th className="text-left py-2">Height</th>
              <th className="text-left py-2">Hash</th>
              <th className="text-left py-2">Age</th>
              <th className="text-left py-2">Txs</th>
              <th className="text-left py-2">Gas Used</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {latestBlocks.map((b) => {
              const ageLabel = formatDistanceToNowStrict(new Date(b.timestamp));
              const isNew = (() => {
                const ms = Date.now() - new Date(b.timestamp).getTime();
                return ms >= 0 && ms < 30_000;
              })();
              const txCount = Array.isArray((b as any).transactions) ? (b as any).transactions.length : (b as any).txs?.length ?? (b as any).tx_count ?? 0;
              const gasUsedHex = (b as any).gasUsed ?? (b as any).gas_used;
              const gasLimitHex = (b as any).gasLimit ?? (b as any).gas_limit;
              const gasUsed = typeof gasUsedHex === "string" && gasUsedHex.startsWith("0x") ? parseInt(gasUsedHex, 16) : Number(gasUsedHex ?? 0);
              const gasLimit = typeof gasLimitHex === "string" && gasLimitHex.startsWith("0x") ? parseInt(gasLimitHex, 16) : Number(gasLimitHex ?? 0);
              const gasPct = gasLimit > 0 ? Math.min(100, Math.round((gasUsed / gasLimit) * 100)) : 0;
              return (
                <tr key={b.height} className="border-t hover:shadow-sm transition" style={{ borderColor: "var(--color-border)" }}>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <CubeIcon className="w-4 h-4 text-primary" />
                      <span className="font-semibold">#{b.height}</span>
                      {isNew ? <Badge color="green">New</Badge> : null}
                    </div>
                  </td>
                  <td className="py-2 font-mono">{b.hash.slice(0, 14)}…</td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 opacity-80">
                      <ClockIcon className="w-3.5 h-3.5 opacity-70" />
                      {ageLabel}
                    </span>
                  </td>
                  <td className="py-2">{txCount}</td>
                  <td className="py-2 w-44">
                    <div className="w-full h-2 rounded bg-white/10 overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                      <div className="h-full bg-primary" style={{ width: `${gasPct}%` }} />
                    </div>
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <CheckIcon className="w-4 h-4" /> Finalized
                    </span>
                  </td>
                  <td className="py-2">
                    <Link href={`/blocks/${b.height}`} className="underline underline-offset-2">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


