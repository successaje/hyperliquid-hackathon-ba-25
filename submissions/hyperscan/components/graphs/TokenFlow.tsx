"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// Recharts Sankey is not SSR-friendly; load dynamically on client
const Sankey = dynamic(() => import("recharts").then((m) => m.Sankey as any), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip as any), { ssr: false });

type Node = { name: string };
type Link = { source: number; target: number; value: number };

export function TokenFlow({ address }: { address: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: implement Lava-powered token flow graph.
        if (alive) {
          setNodes([]);
          setLinks([]);
        }
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load token flow");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [address]);

  const container = useMemo(
    () => (
      <div className="w-full h-[380px]">
        {/* @ts-expect-error dynamic recharts types */}
        <Sankey
          width={800}
          height={360}
          data={{ nodes, links }}
          nodePadding={20}
          nodeWidth={12}
          margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
          linkCurvature={0.5}
        >
          {/* @ts-expect-error dynamic recharts types */}
          <Tooltip />
        </Sankey>
      </div>
    ),
    [nodes, links]
  );

  if (loading) return <div className="text-sm text-white/60">Loading token flows…</div>;
  if (error) return <div className="text-sm text-red-400">{error}</div>;
  if (!nodes.length) return <div className="text-sm text-white/60">Token flow visualization coming soon.</div>;

  return container;
}


