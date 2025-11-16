"use client";

import { useEffect, useState } from "react";
import { fetchHypePrice } from "../../lib/prices";

export function PriceTicker() {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await fetchHypePrice();
      if (alive) setPrice(p);
    })();
    const id = setInterval(async () => {
      const p = await fetchHypePrice();
      setPrice(p);
    }, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return (
    <div className="card p-4 bg-gradient-to-r from-[#0ea5e9]/20 to-[#7c3aed]/20">
      <div className="text-sm opacity-60">HYPE (HyperCore)</div>
      <div className="text-2xl font-semibold">{price !== null ? `$${price.toFixed(4)}` : "—"}</div>
    </div>
  );
}


