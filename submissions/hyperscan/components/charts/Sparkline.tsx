"use client";

import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer as any), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart as any), { ssr: false });
const Area = dynamic(() => import("recharts").then(m => m.Area as any), { ssr: false });

export function Sparkline({ points, color = "#00E0FF" }: { points: number[]; color?: string }) {
  const data = points.map((v, i) => ({ i, v }));
  return (
    <div className="w-full h-10">
      {/* @ts-expect-error dynamic recharts types */}
      <ResponsiveContainer>
        {/* @ts-expect-error dynamic recharts types */}
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
          {/* @ts-expect-error dynamic recharts types */}
          <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


