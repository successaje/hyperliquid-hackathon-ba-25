"use client";

import { useState } from "react";
import { scanContract } from "../../../lib/scanner";
import { Badge } from "../../../components/ui/Badge";

export default function SecurityScannerPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Awaited<ReturnType<typeof scanContract>> | null>(null);

  const runScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await scanContract(address.trim());
      setResult(res);
    } catch (e: any) {
      setError(e?.message ?? "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = (n: number) => (n >= 80 ? "green" : n >= 60 ? "yellow" : "red");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Hyperliquid Smart Contract Security Scanner</h1>
      <div className="card p-4 space-y-3 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            className="sm:col-span-5 px-3 py-2 rounded border border-white/10 bg-transparent"
            placeholder="Enter contract address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button onClick={runScan} disabled={loading || !address} className="sm:col-span-1 px-3 py-2 rounded border border-white/10 hover:border-white/20">
            {loading ? "Scanning…" : "Scan"}
          </button>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
      </div>
      {result && (
        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-60">Security Score</div>
                <div className="text-3xl font-semibold">{result.healthScore}/100</div>
              </div>
              <Badge color={riskColor(result.healthScore)}>Risk: {riskColor(result.healthScore).toUpperCase()}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-2">Findings</h2>
              <ul className="divide-y divide-white/5">
                {result.checks.map((c) => (
                  <li key={c.id} className="py-2 text-sm flex items-start justify-between">
                    <div>
                      <div className="opacity-90">{c.label}</div>
                      {c.info && <div className="text-xs opacity-60">{c.info}</div>}
                    </div>
                    <Badge color={c.passed ? "green" : c.severity === "high" ? "red" : "yellow"}>{c.passed ? "Passed" : c.severity}</Badge>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
              <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
                <li>Use checks-effects-interactions pattern to mitigate reentrancy risk.</li>
                <li>Restrict admin functions with role-based access control (e.g., Ownable).</li>
                <li>Validate arithmetic assumptions; prefer SafeMath or Solidity ^0.8 checks.</li>
                <li>When using proxies, document upgrade strategy, admin keys, and timelocks.</li>
                <li>Namespace storage slots to prevent collisions across upgrades.</li>
              </ul>
            </div>
          </div>
          {!!(result.anomalies?.length) && (
            <div className="card p-4">
              <h2 className="text-lg font-semibold mb-2">Detected Anomalies (ERC‑20)</h2>
              <ul className="divide-y divide-white/5">
                {result.anomalies!.map((a) => (
                  <li key={a.id} className="py-2 text-sm flex items-center justify-between">
                    <div className="opacity-90">{a.label}</div>
                    <Badge color={a.severity === "high" ? "red" : a.severity === "medium" ? "yellow" : "blue"}>{a.severity}</Badge>
                  </li>
                ))}
              </ul>
              <div className="text-xs opacity-60 mt-2">Heuristic analysis; validate on-chain before acting.</div>
            </div>
          )}
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Best Practices for HyperEVM</h2>
            <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
              <li>Use event emissions for all state-changing actions for indexability.</li>
              <li>Set sensible gas bounds; test with eth_estimateGas.</li>
              <li>Prefer pull over push payment patterns.</li>
              <li>Avoid delegatecall where possible; if used, restrict and audit thoroughly.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


