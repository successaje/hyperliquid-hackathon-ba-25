"use client";

import { useEffect, useState } from "react";
import { Lava } from "../lib/lavaClient";

function formatGwei(hexOrDec: string | number) {
  const n = typeof hexOrDec === "string" && hexOrDec.startsWith("0x") ? parseInt(hexOrDec, 16) : Number(hexOrDec);
  return (n / 1e9).toFixed(2) + " gwei";
}

export function GasStats() {
  const [gasPrice, setGasPrice] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [gp, mp, fh] = await Promise.all([
          Lava.gasPrice(),
          Lava.maxPriorityFeePerGas(),
          Lava.feeHistory("0x10", "latest", []),
        ]);
        if (!alive) return;
        setGasPrice(formatGwei(gp));
        setPriority(formatGwei(mp));
        const base = Array.isArray(fh?.baseFeePerGas) ? fh.baseFeePerGas.map((x: string) => parseInt(x, 16)) : [];
        setHistory(base.slice(-12));
      } catch {}
    })();
    const id = setInterval(async () => {
      try {
        const [gp, mp, fh] = await Promise.all([
          Lava.gasPrice(),
          Lava.maxPriorityFeePerGas(),
          Lava.feeHistory("0x10", "latest", []),
        ]);
        setGasPrice(formatGwei(gp));
        setPriority(formatGwei(mp));
        const base = Array.isArray(fh?.baseFeePerGas) ? fh.baseFeePerGas.map((x: string) => parseInt(x, 16)) : [];
        setHistory(base.slice(-12));
      } catch {}
    }, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20">
        <div className="text-sm opacity-60">Gas Price</div>
        <div className="text-2xl font-semibold">{gasPrice || "—"}</div>
      </div>
      <div className="card p-4 bg-gradient-to-b from-[#0f172a]/60 to-[#0f172a]/20">
        <div className="text-sm opacity-60">Max Priority Fee</div>
        <div className="text-2xl font-semibold">{priority || "—"}</div>
        {/* simple inline sparkline using width proportional bars */}
        <div className="mt-2 flex items-end gap-1 h-10">
          {history.map((v, i) => (
            <div key={i} className="bg-primary/60" style={{ width: 6, height: Math.max(2, (v / Math.max(1, Math.max(...history))) * 32) }} />
          ))}
        </div>
      </div>
    </div>
  );
}


