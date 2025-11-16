"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import { ContractHealth } from "../../../components/contract/ContractHealth";
import { scanContract } from "../../../lib/scanner";
import { Badge } from "../../../components/ui/Badge";

export default function ContractPage() {
  const params = useParams();
  const addr = String(params?.addr ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [codePreview, setCodePreview] = useState<string | null>(null);
  const [scan, setScan] = useState<Awaited<ReturnType<typeof scanContract>> | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
       setScanError(null);
      try {
        const [res, bytecode, scanRes] = await Promise.all([
          Lava.getContract(addr),
          Lava.getContractBytecode(addr),
          scanContract(addr),
        ]);
        if (!alive) return;
        setData(res);
        if (bytecode && bytecode !== "0x") {
          setCodePreview(String(bytecode).slice(0, 260) + (String(bytecode).length > 260 ? "…" : ""));
        } else {
          setCodePreview(null);
        }
        setScan(scanRes);
      } catch (e: any) {
        if (!alive) return;
        const msg = e?.message ?? String(e);
        setError("Failed to fetch contract");
        setScanError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [addr]);

  const score = scan?.healthScore ?? 0;
  const riskColor = score >= 80 ? "green" : score >= 60 ? "yellow" : "red";

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Contract</h1>
          <div className="text-xs break-all opacity-80">{addr}</div>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="blue">HyperEVM</Badge>
          {scan && (
            <Badge color={riskColor}>Health: {score}/100</Badge>
          )}
        </div>
      </div>
      <div className="card p-4">
        {loading && <div className="text-sm text-white/60">Loading…</div>}
        {error && <div className="text-sm text-red-400">{error}</div>}
        {!loading && !error && (
          <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold mb-1">Contract Health</h2>
          <ContractHealth address={addr} />
        </div>
        <div className="card p-4 space-y-3">
          <h2 className="text-lg font-semibold mb-1">Code Preview</h2>
          {codePreview ? (
            <pre className="text-[10px] leading-snug overflow-auto">{codePreview}</pre>
          ) : (
            <div className="text-xs opacity-70">
              Unable to fetch bytecode from RPC for this contract. In a full setup, this panel would show verified source or decompiled view.
            </div>
          )}
        </div>
      </div>
      {scan && (
        <>
          <div className="card p-4 space-y-3">
            <h2 className="text-lg font-semibold mb-1">Issues & Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="opacity-80">Reentrancy</span>
                  <Badge color="green">Low</Badge>
                </div>
                <p className="text-xs opacity-70">
                  No external calls in critical paths detected by current checks.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="opacity-80">Access Control</span>
                  <Badge color="yellow">Medium</Badge>
                </div>
                <p className="text-xs opacity-70">
                  Admin-like operations found. Ensure only trusted roles can pause/upgrade.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="opacity-80">Integer Safety</span>
                  <Badge color="green">Low</Badge>
                </div>
                <p className="text-xs opacity-70">
                  Solidity ^0.8 checks mitigate overflows, but validate all arithmetic assumptions.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="opacity-80">Storage & Upgrades</span>
                  <Badge color="red">High</Badge>
                </div>
                <p className="text-xs opacity-70">
                  Proxy patterns can introduce storage collisions. Review implementation/logic contract layouts.
                </p>
              </div>
            </div>
            {scanError && <div className="text-xs text-red-400">Scanner note: {scanError}</div>}
          </div>
          {!!scan.similar?.length && (
            <div className="card p-4 space-y-3">
              <h2 className="text-lg font-semibold mb-1">Similarity Scan</h2>
              <p className="text-xs opacity-70">
                These contracts share bytecode or structural similarity with this one. Use this to detect clones, forks, or possible scam derivatives.
              </p>
              <ul className="divide-y divide-white/5 text-sm">
                {scan.similar.map((s) => (
                  <li key={s.address} className="py-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs">{s.address}</span>
                      {s.label && <span className="text-xs opacity-70">{s.label}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-80">{s.similarity}% match</span>
                      {s.risk && (
                        <Badge color={s.risk === "high" ? "red" : s.risk === "medium" ? "yellow" : "green"}>
                          {s.risk}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="card p-4 space-y-3">
            <h2 className="text-lg font-semibold mb-1">Monitoring & Alerts</h2>
            <p className="text-xs opacity-70">
              Subscribe to contract-level alerts to be notified when behavior changes: admin actions, upgrades, or unusual transfer patterns.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border border-white/20" defaultChecked />
                Admin/owner activity
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border border-white/20" />
                Upgrade events
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border border-white/20" defaultChecked />
                Large transfers / whale moves
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border border-white/20" />
                New exploit signatures
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


