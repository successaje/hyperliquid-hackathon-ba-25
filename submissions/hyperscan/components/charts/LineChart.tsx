"use client";

import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer as any), { ssr: false });
const LineChartBase = dynamic(() => import("recharts").then(m => m.LineChart as any), { ssr: false });
const Line = dynamic(() => import("recharts").then(m => m.Line as any), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis as any), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis as any), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip as any), { ssr: false });

export function LineChart({ series, color = "#00E0FF", height = 160 }: { series: Array<{ t: number; v: number }>; color?: string; height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      {/* @ts-expect-error dynamic recharts types */}
      <ResponsiveContainer>
        {/* @ts-expect-error dynamic recharts types */}
        <LineChartBase data={series}>
          {/* @ts-expect-error dynamic recharts types */}
          <XAxis dataKey="t" hide />
          {/* @ts-expect-error dynamic recharts types */}
          <YAxis hide />
          {/* @ts-expect-error dynamic recharts types */}
          <Tooltip />
          {/* @ts-expect-error dynamic recharts types */}
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
        </LineChartBase>
      </ResponsiveContainer>
    </div>
  );
}


