"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import { TokenFlow } from "../../../components/graphs/TokenFlow";
import { HoldingsChart } from "../../../components/graphs/HoldingsChart";

export default function AddressPage() {
  const params = useParams();
  const addr = String(params?.addr ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Array<{ asset: string; balance: number }>>([]);
  const [nativeBalance, setNativeBalance] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [bals, wei] = await Promise.all([
          Lava.getAddressBalances(addr),
          Lava.getBalance(addr, "latest"),
        ]);
        if (alive) setBalances(bals);
        if (alive) {
          const v = typeof wei === "string" && wei.startsWith("0x") ? parseInt(wei, 16) : Number(wei);
          setNativeBalance((v / 1e18).toFixed(6) + " ETH");
        }
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
          <div className="text-sm opacity-70">
            Address activity and labels will appear here as we add more Hyperliquid indexing.
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">Balances</h2>
          <div className="mb-2 text-sm">Native: <span className="opacity-80">{nativeBalance || "—"}</span></div>
          {balances.length ? (
            <ul className="text-sm divide-y divide-white/5">
              {balances.map((b) => (
                <li key={b.asset} className="py-1 flex items-center justify-between">
                  <span className="opacity-80">{b.asset}</span>
                  <span className="opacity-70">{b.balance.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-foreground opacity-60">No balances.</div>
          )}
        </div>
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2">Holdings</h2>
          <HoldingsChart data={balances} />
        </div>
      </div>
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Token Flow</h2>
        <TokenFlow address={addr} />
      </div>
    </div>
  );
}


