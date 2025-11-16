"use client";

export function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" | "red" | "yellow" | "purple" }) {
  const map: Record<string, string> = {
    blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    green: "bg-green-500/15 text-green-300 border-green-500/30",
    red: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    yellow: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    purple: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
  };
  return <span className={`px-2 py-0.5 text-xxs sm:text-xs rounded-full border ${map[color]}`}>{children}</span>;
}


