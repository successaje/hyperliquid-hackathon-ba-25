"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import { TokenFlow } from "../../../components/graphs/TokenFlow";

export default function AddressPage() {
  const params = useParams();
  const addr = String(params?.addr ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await Lava.getAddress(addr);
        if (alive) setData(res);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to fetch address");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [addr]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Address</h1>
      <div className="card p-4">
        <div className="text-xs break-all">{addr}</div>
      </div>
      <div className="card p-4">
        {loading && <div className="text-sm text-white/60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && (
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Token Flow</h2>
        <TokenFlow address={addr} />
      </div>
    </div>
  );
}


