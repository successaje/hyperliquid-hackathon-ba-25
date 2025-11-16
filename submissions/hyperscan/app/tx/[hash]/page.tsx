"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";

export default function TxPage() {
  const params = useParams();
  const hash = String(params?.hash ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [res, rec] = await Promise.all([
          Lava.getTransaction(hash),
          Lava.getTransactionReceipt(hash),
        ]);
        if (alive) {
          setData(res);
          setReceipt(rec);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to fetch transaction");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [hash]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transaction</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 space-y-3">
          <div className="text-xs break-all">{hash}</div>
          {!loading && !error && (
            <div className="space-y-2 text-sm">
              <div>Status: <span className={receipt?.status ? "text-green-400" : "text-red-400"}>{receipt?.status ? "Success" : "Failed"}</span></div>
              <div>Block: <span className="opacity-80">{receipt?.blockNumber ?? data?.blockNumber}</span></div>
              <div>Gas Used: <span className="opacity-80">{receipt?.gasUsed ?? data?.gas}</span></div>
              <div>Value: <span className="opacity-80">{data?.value}</span></div>
              <div>Events: <span className="opacity-80">{Array.isArray(receipt?.logs) ? receipt.logs.length : 0}</span></div>
              <div>Timestamp: <span className="opacity-80">{data?.timestamp ?? ""}</span></div>
            </div>
          )}
        </div>
        <div className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Transfers & Parties</h2>
          {!loading && !error && (
            <div className="space-y-1 text-sm">
              <div>From: <span className="opacity-80 break-all">{data?.from}</span></div>
              <div>To: <span className="opacity-80 break-all">{data?.to}</span></div>
            </div>
          )}
        </div>
      </div>
      {!loading && !error && (
        <div className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Logs</h2>
          {Array.isArray(receipt?.logs) && receipt.logs.length ? (
            <ul className="divide-y divide-white/5 text-xs">
              {receipt.logs.map((l: any, i: number) => (
                <li key={i} className="py-2">
                  <div>Address: <span className="font-mono">{l.address}</span></div>
                  <div>Topics: {Array.isArray(l.topics) ? l.topics.map((t: string) => t.slice(0, 14) + "…").join(", ") : ""}</div>
                  <div>Data: <span className="font-mono">{String(l.data).slice(0, 32)}…</span></div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs opacity-60">No logs.</div>
          )}
        </div>
      )}
      <div className="card p-4">
        {loading && <div className="text-sm text-white/60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && (
          <pre className="text-xs overflow-auto">{JSON.stringify({ tx: data, receipt }, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}


