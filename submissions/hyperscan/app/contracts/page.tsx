"use client";

import Link from "next/link";
import { HYPER_TOKENS } from "../../lib/tokens";
import { Badge } from "../../components/ui/Badge";

export default function ContractsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Contracts</h1>
        <Link href="/security/scanner" className="text-sm underline underline-offset-2">
          Open Security Scanner
        </Link>
      </div>
      <div className="card p-4 space-y-2">
        <div className="text-sm opacity-80">
          This is where HyperScan becomes more than an explorer.
        </div>
        <div className="text-sm opacity-70">
          Each contract can be inspected with automated health checks powered by Slither-style static analysis and on-chain behavior heuristics. You get a security score, potential vulnerabilities, function risks, and behavior patterns in one place.
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HYPER_TOKENS.map((t) => (
          <div key={t.address} className="card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{t.symbol}</div>
                <div className="text-xs opacity-70">{t.name}</div>
              </div>
              <Badge color="blue">Token</Badge>
            </div>
            <div className="text-xs break-all opacity-70">{t.address}</div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <Link href={`/contract/${t.address}`} className="underline underline-offset-2">
                View contract
              </Link>
              <span className="opacity-40">•</span>
              <Link href={`/security/scanner?address=${t.address}`} className="underline underline-offset-2">
                Run health scan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

