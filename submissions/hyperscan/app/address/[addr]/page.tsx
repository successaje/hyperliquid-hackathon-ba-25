"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Lava } from "../../../lib/lavaClient";
import { TokenFlow } from "../../../components/graphs/TokenFlow";
import { HoldingsChart } from "../../../components/graphs/HoldingsChart";
import { HYPER_TOKENS, KnownToken } from "../../../lib/tokens";

function encodeBalanceOfCall(address: string): string {
  // balanceOf(address) selector: 0x70a08231
  const selector = "70a08231";
  const addrNoPrefix = address.toLowerCase().replace(/^0x/, "");
  const padded = addrNoPrefix.padStart(64, "0");
  return "0x" + selector + padded;
}

export default function AddressPage() {
  const params = useParams();
  const addr = String(params?.addr ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Array<{ token: KnownToken; balance: number }>>([]);
  const [nativeBalance, setNativeBalance] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [wei, ...ercCalls] = await Promise.all([
          Lava.getBalance(addr, "latest"),
          ...HYPER_TOKENS.map((t) => Lava.ethCall({ to: t.address, data: encodeBalanceOfCall(addr) }, "latest")),
        ]);
        if (alive) {
          const ercBalances = ercCalls.map((raw, idx) => {
            const token = HYPER_TOKENS[idx];
            if (typeof raw !== "string" || !raw.startsWith("0x")) return { token, balance: 0 };
            const bn = BigInt(raw || "0x0");
            const denom = BigInt(10) ** BigInt(token.decimals);
            const integer = Number(bn / denom);
            const fraction = Number(bn % denom) / Number(denom);
            const val = integer + fraction;
            return { token, balance: val };
          }).filter((b) => b.balance > 0);
          setBalances(ercBalances);
        }
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
                <li key={b.token.address} className="py-1 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="opacity-80">{b.token.symbol}</span>
                    <span className="text-xs opacity-60">{b.token.name}</span>
                  </div>
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
          <HoldingsChart data={balances.map((b) => ({ asset: b.token.symbol, balance: b.balance }))} />
        </div>
      </div>
      <div className="card p-4">
        <h2 className="text-lg font-semibold mb-2">Token Flow</h2>
        <TokenFlow address={addr} />
      </div>
    </div>
  );
}


