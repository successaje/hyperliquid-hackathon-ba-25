# HyperScan – Hyperliquid + Lava Explorer (Testnet)

HyperScan is a next‑generation explorer for the Hyperliquid testnet, built on Lava RPC with a focus on real‑time data, contract security, and wallet intelligence.

---

## Features

- **Live Network Dashboard**
  - Real‑time blocks and transactions (via Lava JSON‑RPC)
  - Metrics: TPS, latest block, average gas
  - Animated live transaction feed

- **Blocks & Transactions**
  - Blocks table with height, age, tx count, gas‑used bar, finalized status
  - Block detail page: full tx list + Hyperliquid system transactions
  - Transaction detail page: status, gas, logs, decoded context

- **Wallet / Address View**
  - Native balance (`eth_getBalance`)
  - Portfolio‑style balances for Hyperliquid testnet tokens:
    - MBTC, HPSX, USDC (test), sUSDe, WETH
  - Holdings pie chart
  - Inflows/outflows summary and simple anomaly heuristics

- **Contracts & Security**
  - Contracts hub listing key Hyperliquid contracts (tokens, LPs)
  - Contract page:
    - Security score & risk categories (reentrancy, access control, upgrades, etc.)
    - `eth_getCode` integration to detect code/bytecode
    - Similarity Scan: shows structurally similar contracts (clones/forks/scam‑like)
    - Monitoring toggles for admin actions, upgrades, whale moves, exploit signatures

- **Security Scanner**
  - `/security/scanner` to analyze any contract address
  - Slither‑style health checks via an internal API
  - ERC‑20 anomaly detection (whale dominance, transfer surges) from `eth_getLogs`

- **Extras**
  - Tokens page with charts and 24h stats
  - HyperCore ⇄ HyperEVM bridge UI stub
  - API Playground page to call Lava RPC methods directly

---

## Tech Stack

- **Framework**: Next.js (App Router), React, TypeScript
- **UI**: Tailwind CSS, Framer Motion
- **State**: Zustand
- **Charts**: Recharts
- **RPC**: Lava JSON‑RPC (Hyperliquid Testnet)
- **Auth (optional)**: Privy (email/embedded wallets; guarded by env + provider checks)

---

## Getting Started

From the `submissions/hyperscan` directory:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in `submissions/hyperscan`:

```bash
LAVA_HYPERLIQUID_RPC_URL=https://g.w.lavanet.xyz:443/gateway/hyperliquidt/rpc-http/YOUR_KEY

# Optional:
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id        # Privy login
NEXT_PUBLIC_PRICE_ENDPOINT=https://...            # HYPE price feed
```

---

## Lava RPC Integration

HyperScan talks to Hyperliquid testnet **only via Lava JSON‑RPC**. Integration happens in two layers:

- **1) Next.js API proxy**

`app/api/lava/route.ts` forwards all JSON‑RPC calls to your Lava gateway:

```ts
// app/api/lava/route.ts
export async function POST(req: NextRequest) {
  const { method, params } = await req.json();
  const url =
    process.env.LAVA_HYPERLIQUID_RPC_URL ||
    "https://g.w.lavanet.xyz:443/gateway/hyperliquidt/rpc-http/YOUR_KEY";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params: params ?? [] }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.ok ? 200 : res.status });
}
```

- **2) Typed client helpers**

`lib/lavaClient.ts` wraps Lava RPC calls in small helpers used across the app:

```ts
// lib/lavaClient.ts
async function callRpc<T = any>(method: string, params: any[] = []): Promise<T> {
  const res = await fetch("/api/lava", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, params }),
    cache: "no-store",
  });
  const data = (await res.json()) as JsonRpcResponse;
  if (!res.ok || data.error) throw new Error(JSON.stringify(data.error ?? data));
  return data.result as T;
}

export const Lava = {
  blockNumber: (): Promise<number> =>
    callRpc("eth_blockNumber", []).then((hex) => parseInt(hex, 16)),
  getBlockByNumber: (n: number, full = true) =>
    callRpc("eth_getBlockByNumber", ["0x" + n.toString(16), full]),
  getTransaction: (hash: string) =>
    callRpc("eth_getTransactionByHash", [hash]),
  getBalance: (address: string, tag = "latest") =>
    callRpc("eth_getBalance", [address, tag]),
  getLogs: (filter: Record<string, any>) =>
    callRpc("eth_getLogs", [filter]),
  ethCall: (tx: Record<string, any>, tag = "latest") =>
    callRpc("eth_call", [tx, tag]),
};
```

These helpers power:

- **Realtime dashboard** (`hooks/useRealtime.ts`)
  - `Lava.blockNumber()` and `Lava.getBlockByNumber()` → latest blocks, txs, TPS, avg gas
- **Tx & block pages**
  - `Lava.getTransaction()` + `eth_getTransactionReceipt` for `/tx/[hash]`
  - `Lava.getBlockByNumber()` for `/blocks` and `/blocks/[height]`
- **Wallet & token views**
  - `Lava.getBalance()` for native balance
  - `Lava.ethCall({ to: tokenAddress, data: balanceOf(address) })` to fetch ERC‑20 balances
- **Security & anomaly detection**
  - `Lava.getLogs()` to scan `Transfer` events for ERC‑20 anomalies and address activity

All RPC traffic stays behind `/api/lava`, so you can swap the underlying Lava endpoint or add auth without changing any UI code.

---

## Notes

- All chain data is fetched via the configured Lava gateway on the Hyperliquid testnet.
- Similarity Scan and Slither integration are wired through internal Next.js API routes; you can swap these stubs for real backend services without changing the UI. 


