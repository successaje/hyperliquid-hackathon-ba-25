"use client";

import { useExplorerStore } from "../../lib/store";
import { useEffect } from "react";
import { useRealtime } from "../../hooks/useRealtime";
import Link from "next/link";
import { formatDistanceToNowStrict } from "../../utils/format";

export default function BlocksPage() {
  const { latestBlocks } = useExplorerStore();
  const { start, stop } = useRealtime();
  useEffect(() => {
    start();
    return () => stop();
  }, [start, stop]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Blocks</h1>
      <div className="card p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-foreground opacity-60">
            <tr>
              <th className="text-left py-2">Height</th>
              <th className="text-left py-2">Hash</th>
              <th className="text-left py-2">Age</th>
              <th className="text-left py-2">Details</th>
            </tr>
          </thead>
        <tbody>
            {latestBlocks.map((b) => (
              <tr key={b.height} className="border-t border-white/5">
                <td className="py-2">#{b.height}</td>
                <td className="py-2 font-mono">{b.hash.slice(0, 14)}…</td>
                <td className="py-2 opacity-60">{formatDistanceToNowStrict(new Date(b.timestamp))}</td>
                <td className="py-2">
                  <Link href={`/blocks/${b.height}`} className="underline underline-offset-2">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


