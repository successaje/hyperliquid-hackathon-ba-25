import { Lava } from "./lavaClient";

export type ResolvedTarget =
  | { type: "tx"; href: string }
  | { type: "block"; href: string }
  | { type: "address"; href: string }
  | { type: "contract"; href: string }
  | { type: "unknown"; href: string };

function isHexPrefixed(s: string) {
  return /^0x[0-9a-fA-F]+$/.test(s);
}

export async function resolveQueryToRoute(input: string): Promise<ResolvedTarget> {
  const q = input.trim();
  if (!q) return { type: "unknown", href: "/" };

  // Heuristic by length first
  if (isHexPrefixed(q)) {
    if (q.length === 66) {
      // Could be tx hash or block hash
      try {
        const tx = await Lava.getTransaction(q);
        if (tx) return { type: "tx", href: `/tx/${q}` };
      } catch {}
      try {
        const blk = await Lava.getBlockByHash(q, false);
        if (blk) return { type: "block", href: `/blocks/${parseInt(blk.number ?? "0", 16)}` };
      } catch {}
      // Fallback to tx route
      return { type: "tx", href: `/tx/${q}` };
    }
    if (q.length === 42) {
      // Address vs contract (has code?)
      try {
        const code = await Lava.getContractBytecode(q);
        const isContract = !!code && code !== "0x";
        if (isContract) {
          // Try to detect ERC-20 by calling symbol()
          try {
            const data = "0x95d89b41"; // symbol()
            const res = await Lava.ethCall({ to: q, data }, "latest");
            if (typeof res === "string" && res !== "0x") {
              return { type: "contract", href: `/contract/${q}` };
            }
          } catch {}
          return { type: "contract", href: `/contract/${q}` };
        }
      } catch {}
      return { type: "address", href: `/address/${q}` };
    }
  }

  // As a last resort, try to parse decimal block number
  if (/^\d+$/.test(q)) {
    return { type: "block", href: `/blocks/${q}` };
  }

  // Unknown -> try address route to let UI handle it
  return { type: "unknown", href: `/address/${q}` };
}


