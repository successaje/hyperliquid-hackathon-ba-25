export function toHex(n: number | string): string {
  if (typeof n === "string" && n.startsWith("0x")) return n;
  const num = Number(n);
  if (!Number.isFinite(num)) return "0x0";
  return "0x" + num.toString(16);
}


