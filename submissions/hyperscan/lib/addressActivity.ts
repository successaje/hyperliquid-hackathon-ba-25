import { Lava } from "./lavaClient";
import { HYPER_TOKENS } from "./tokens";

export type AddressTransfer = {
  hash: string;
  token: string;
  direction: "in" | "out";
  counterparty: string;
  amount: number;
  timestamp: number;
};

export type AddressActivitySummary = {
  totalIn: number;
  totalOut: number;
  net: number;
  byToken: Record<string, { in: number; out: number }>;
};

export type AddressActivityAnomaly = {
  id: string;
  label: string;
  severity: "low" | "medium" | "high";
};

export type AddressActivity = {
  transfers: AddressTransfer[];
  summary: AddressActivitySummary;
  anomalies: AddressActivityAnomaly[];
};

function encodeBalanceOfCall(address: string): string {
  const selector = "70a08231"; // balanceOf(address)
  const addrNoPrefix = address.toLowerCase().replace(/^0x/, "");
  const padded = addrNoPrefix.padStart(64, "0");
  return "0x" + selector + padded;
}

export async function fetchAddressActivity(address: string): Promise<AddressActivity> {
  const lower = address.toLowerCase();
  // Fetch native balance and token balances are handled elsewhere; here we focus on flows.
  const fromBlock = "0x0";
  const toBlock = "latest";

  const transfers: AddressTransfer[] = [];

  for (const token of HYPER_TOKENS) {
    try {
      const logs = await Lava.getLogs({
        fromBlock,
        toBlock,
        address: token.address,
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"], // Transfer(address,address,uint256)
      });
      if (!Array.isArray(logs)) continue;
      for (const l of logs) {
        if (!Array.isArray(l.topics) || l.topics.length < 3) continue;
        const from = "0x" + l.topics[1].slice(26).toLowerCase();
        const to = "0x" + l.topics[2].slice(26).toLowerCase();
        if (from !== lower && to !== lower) continue;
        const dir: "in" | "out" = to === lower ? "in" : "out";
        const counter = dir === "in" ? from : to;
        const raw = typeof l.data === "string" ? l.data : "0x0";
        const bn = BigInt(raw || "0x0");
        const denom = BigInt(10) ** BigInt(token.decimals);
        const integer = Number(bn / denom);
        const fraction = Number(bn % denom) / Number(denom);
        const amount = integer + fraction;
        transfers.push({
          hash: l.transactionHash ?? l.txHash ?? "",
          token: token.symbol,
          direction: dir,
          counterparty: counter,
          amount,
          timestamp: l.time ? Number(l.time) * 1000 : Date.now(),
        });
      }
    } catch {
      // ignore per-token failures
    }
  }

  // Summary
  const summary: AddressActivitySummary = {
    totalIn: 0,
    totalOut: 0,
    net: 0,
    byToken: {},
  };
  for (const t of transfers) {
    if (!summary.byToken[t.token]) summary.byToken[t.token] = { in: 0, out: 0 };
    if (t.direction === "in") {
      summary.totalIn += t.amount;
      summary.byToken[t.token].in += t.amount;
    } else {
      summary.totalOut += t.amount;
      summary.byToken[t.token].out += t.amount;
    }
  }
  summary.net = summary.totalIn - summary.totalOut;

  // Anomalies (simple heuristics)
  const anomalies: AddressActivityAnomaly[] = [];
  const largeOut = summary.totalOut > summary.totalIn * 2 && summary.totalOut > 10_000;
  if (largeOut) {
    anomalies.push({
      id: "whale-outflow",
      label: "Significant net outflows detected",
      severity: "high",
    });
  }
  const manySmallIn = transfers.filter((t) => t.direction === "in" && t.amount < 1).length;
  if (manySmallIn > 50) {
    anomalies.push({
      id: "many-small-in",
      label: "Many small inflows; potential farming or sybil-like behavior",
      severity: "medium",
    });
  }

  return { transfers: transfers.sort((a, b) => b.timestamp - a.timestamp), summary, anomalies };
}


