"use client";

import { useEffect, useState } from "react";
import { scanContract, ContractScanResult } from "../../lib/scanner";

export function ContractHealth({ address }: { address: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ContractScanResult | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await scanContract(address);
        if (alive) setResult(res);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to run scanner");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [address]);

  if (loading) return <div className="text-sm text-white/60">Scanning…</div>;
  if (error) return <div className="text-sm text-red-400">{error}</div>;
  if (!result) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">Health Score</div>
        <div className="text-2xl font-semibold">{result.healthScore}/100</div>
      </div>
      <div className="space-y-2">
        {result.checks.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className={
                  c.passed ? "text-green-400" : c.severity === "high" ? "text-red-400" : "text-yellow-400"
                }
              >
                {c.passed ? "✓" : "!"}
              </span>
              <span>{c.label}</span>
            </div>
            {c.info && <span className="text-xs text-white/50">{c.info}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}


