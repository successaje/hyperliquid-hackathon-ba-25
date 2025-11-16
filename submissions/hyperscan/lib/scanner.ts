import { z } from "zod";

export type ContractScanResult = {
  address: string;
  healthScore: number; // 0 - 100
  checks: Array<{
    id: string;
    label: string;
    passed: boolean;
    severity: "low" | "medium" | "high";
    info?: string;
  }>;
  metadata?: Record<string, any>;
  anomalies?: Array<{
    id: string;
    label: string;
    severity: "low" | "medium" | "high";
    detail?: string;
  }>;
  similar?: Array<{
    address: string;
    similarity: number; // 0 - 100
    label?: string;
    risk?: "low" | "medium" | "high";
  }>;
};

const BytecodeInfo = z.object({
  bytecode: z.string().optional(),
  proxy: z.boolean().optional(),
  compilerVersion: z.string().optional(),
  optimizationUsed: z.boolean().optional(),
});

export async function fetchContractBytecode(address: string): Promise<z.infer<typeof BytecodeInfo>> {
  // Placeholder via Lava when available; return minimal structure for now
  return {
    bytecode: undefined,
    proxy: false,
    compilerVersion: undefined,
    optimizationUsed: undefined,
  };
}

async function detectErc20Anomalies(address: string): Promise<ContractScanResult["anomalies"]> {
  try {
    // ERC20 Transfer topic
    const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const nowHex = "latest";
    const fromBlock = "0x0";
    // @ts-ignore next-line: dynamic import to avoid circular deps
    const { Lava } = await import("./lavaClient");
    const logs = await Lava.getLogs({
      fromBlock,
      toBlock: nowHex,
      address,
      topics: [transferTopic],
    });
    if (!Array.isArray(logs) || logs.length === 0) return [];
    // Heuristics: detect single whale dominance and burst transfers
    const toCounts = new Map<string, number>();
    for (const l of logs) {
      const to = Array.isArray(l.topics) && l.topics.length >= 3 ? l.topics[2] : undefined;
      if (to) toCounts.set(to, (toCounts.get(to) ?? 0) + 1);
    }
    const maxCount = Math.max(0, ...Array.from(toCounts.values()));
    const anomalies: ContractScanResult["anomalies"] = [];
    if (maxCount > Math.max(20, logs.length * 0.2)) {
      anomalies.push({
        id: "whale-dominance",
        label: "Whale destination dominance",
        severity: "medium",
        detail: "Large proportion of transfers to a single address. Investigate distribution risk.",
      });
    }
    if (logs.length > 2000) {
      anomalies.push({
        id: "transfer-surge",
        label: "Transfer surge detected",
        severity: "low",
        detail: "High volume of transfers observed; verify no spam/airdrop abuse.",
      });
    }
    return anomalies;
  } catch {
    return [];
  }
}

export async function scanContract(address: string): Promise<ContractScanResult> {
  // Prefer the Slither-like backend if available, then enrich with runtime anomalies.
  try {
    const res = await fetch("/api/security/slither", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address }),
    });
    if (res.ok) {
      const data = (await res.json()) as ContractScanResult;
      const [anomalies, similar] = await Promise.all([
        detectErc20Anomalies(address),
        fetch("/api/security/similarity", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ address }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);
      return { ...data, anomalies, similar: similar?.similar ?? [] };
    }
  } catch {
    // fall back to local heuristic scan
  }

  const meta = await fetchContractBytecode(address);
  const anomalies = await detectErc20Anomalies(address);

  const checks: ContractScanResult["checks"] = [];

  // Example checks (placeholder heuristics)
  checks.push({
    id: "has-bytecode",
    label: "Has bytecode on-chain",
    passed: Boolean(meta.bytecode && meta.bytecode.length > 2),
    severity: "high",
  });

  checks.push({
    id: "is-proxy",
    label: "Proxy pattern detected",
    passed: meta.proxy === false,
    severity: "medium",
    info: meta.proxy ? "Proxy may upgrade logic; verify admin controls" : undefined,
  });

  checks.push({
    id: "optimizer",
    label: "Compiler optimization used",
    passed: meta.optimizationUsed !== false,
    severity: "low",
  });

  // Score: simple weighting
  const max = checks.length;
  const pass = checks.filter((c) => c.passed).length;
  const healthScore = Math.round((pass / Math.max(1, max)) * 100);

  return {
    address,
    healthScore,
    checks,
    metadata: meta,
    anomalies,
  };
}


