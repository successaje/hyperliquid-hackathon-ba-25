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

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Lava.getTransaction(hash);
        if (alive) setData(res);
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
      <div className="card p-4">
        <div className="text-xs break-all">{hash}</div>
      </div>
      <div className="card p-4">
        {loading && <div className="text-sm text-white/60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && (
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}


