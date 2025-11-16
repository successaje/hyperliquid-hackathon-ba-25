"use client";

import { useState } from "react";

export default function BridgePage() {
  const [from, setFrom] = useState("HyperCore");
  const [to, setTo] = useState("HyperEVM");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("HYPE");

  const swap = () => {
    const f = from; setFrom(to); setTo(f);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">HyperCore ⇄ HyperEVM Bridge</h1>
      <div className="card p-4 space-y-3 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            From
            <select className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={from} onChange={(e) => setFrom(e.target.value)}>
              <option>HyperCore</option>
              <option>HyperEVM</option>
            </select>
          </label>
          <label className="text-sm">
            To
            <select className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={to} onChange={(e) => setTo(e.target.value)}>
              <option>HyperEVM</option>
              <option>HyperCore</option>
            </select>
          </label>
        </div>
        <button onClick={swap} className="px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 text-sm">Swap Directions</button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            Asset
            <select className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={asset} onChange={(e) => setAsset(e.target.value)}>
              <option>HYPE</option>
              <option>USDC</option>
            </select>
          </label>
          <label className="text-sm">
            Amount
            <input className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </label>
        </div>
        <button className="px-3 py-2 rounded-lg border border-white/10 hover:border-white/20 text-sm">
          Bridge
        </button>
      </div>
    </div>
  );
}


