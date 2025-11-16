"use client";

import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer as any), { ssr: false });
const PieChart = dynamic(() => import("recharts").then(m => m.PieChart as any), { ssr: false });
const Pie = dynamic(() => import("recharts").then(m => m.Pie as any), { ssr: false });
const Cell = dynamic(() => import("recharts").then(m => m.Cell as any), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip as any), { ssr: false });
const Legend = dynamic(() => import("recharts").then(m => m.Legend as any), { ssr: false });

export type Holding = { asset: string; balance: number };

const COLORS = ["#6ee7ff", "#a78bfa", "#34d399", "#f59e0b", "#f472b6", "#60a5fa", "#c084fc"];

export function HoldingsChart({ data }: { data: Holding[] }) {
  const chartData = data.map((d) => ({ name: d.asset, value: d.balance }));
  return (
    <div className="w-full h-64">
      {/* @ts-expect-error dynamic recharts types */}
      <ResponsiveContainer>
        {/* @ts-expect-error dynamic recharts types */}
        <PieChart>
          {/* @ts-expect-error dynamic recharts types */}
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40}>
            {chartData.map((entry, index) => (
              // @ts-expect-error dynamic recharts types
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* @ts-expect-error dynamic recharts types */}
          <Tooltip />
          {/* @ts-expect-error dynamic recharts types */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


