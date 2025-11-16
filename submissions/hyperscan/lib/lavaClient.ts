import { z } from "zod";

const JsonRpcResponse = z.object({
  jsonrpc: z.string().optional(),
  id: z.number().or(z.string()).optional(),
  result: z.any().optional(),
  error: z.any().optional(),
});

export type JsonRpcResponse = z.infer<typeof JsonRpcResponse>;

async function callRpc<T = any>(method: string, params: any[] = []): Promise<T> {
  const res = await fetch("/api/lava", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ method, params }),
    cache: "no-store",
  });
  const data = (await res.json()) as JsonRpcResponse;
  if (!res.ok || data.error) {
    throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
    }
  return data.result as T;
}

export const Lava = {
  // Chain & Node Info
  chainId: async (): Promise<string> => callRpc("eth_chainId", []),
  netVersion: async (): Promise<string> => callRpc("net_version", []),
  clientVersion: async (): Promise<string> => callRpc("web3_clientVersion", []),
  syncing: async (): Promise<any> => callRpc("eth_syncing", []),

  getLatestBlocks: async (): Promise<any[]> => {
    try {
      return await callRpc<any[]>("block_latest", []);
    } catch {
      return [];
    }
  },
  getLatestTransactions: async (): Promise<any[]> => {
    try {
      return await callRpc<any[]>("tx_latest", []);
    } catch {
      return [];
    }
  },
  getRecentTransactions: async (limit = 50): Promise<any[]> => {
    try {
      return await callRpc<any[]>("tx_recent", [limit]);
    } catch {
      return [];
    }
  },
  getAddress: async (address: string): Promise<any> => {
    try {
      return await callRpc<any>("address_get", [address]);
    } catch (e) {
      return { address, note: "address_get not implemented in placeholder" };
    }
  },
  getAddressBalances: async (address: string): Promise<Array<{ asset: string; balance: number }>> => {
    try {
      const res = await callRpc<any>("address_balances", [address]);
      if (Array.isArray(res)) {
        return res.map((r: any) => ({
          asset: String(r.asset ?? r.symbol ?? "UNKNOWN"),
          balance: Number(r.balance ?? r.amount ?? 0),
        }));
      }
      return [];
    } catch {
      // If the node doesn't support address_balances, we can't infer all token holdings
      // without an indexer. Return empty and let the UI show "No balances".
      return [];
    }
  },
  getTransaction: async (hash: string): Promise<any> => {
    try {
      return await callRpc<any>("eth_getTransactionByHash", [hash]);
    } catch (e) {
      return { hash, note: "eth_getTransactionByHash failed" };
    }
  },
  getTransactionReceipt: async (hash: string): Promise<any> => {
    try {
      // Fallback to eth_getTransactionReceipt if supported
      return await callRpc<any>("eth_getTransactionReceipt", [hash]);
    } catch {
      return null;
    }
  },
  getContract: async (address: string): Promise<any> => {
    try {
      return await callRpc<any>("contract_get", [address]);
    } catch (e) {
      return { address, note: "contract_get not implemented in placeholder" };
    }
  },
  getContractBytecode: async (address: string): Promise<string | null> => {
    try {
      const res = await callRpc<any>("eth_getCode", [address, "latest"]);
      return typeof res === "string" ? res : res?.bytecode ?? null;
    } catch {
      return null;
    }
  },
  getLogs: async (filter: Record<string, any>): Promise<any[]> => {
    try {
      return await callRpc<any[]>("eth_getLogs", [filter]);
    } catch {
      return [];
    }
  },
  getTokenMetadata: async (addressOrSymbol: string): Promise<any> => {
    try {
      return await callRpc<any>("token_metadata", [addressOrSymbol]);
    } catch {
      return { symbol: addressOrSymbol, note: "token_metadata placeholder" };
    }
  },
  getPendingTransactions: async (limit = 50): Promise<any[]> => {
    try {
      return await callRpc<any[]>("tx_pending", [limit]);
    } catch {
      return [];
    }
  },
  getNetworkMetrics: async (): Promise<{
    tps?: number;
    pending?: number;
    latestBlock?: number;
    gasAvg?: number;
    blockTimeMs?: number;
  }> => {
    try {
      const res = await callRpc<any>("network_metrics", []);
      return {
        tps: Number(res?.tps ?? 0),
        pending: Number(res?.pending ?? 0),
        latestBlock: Number(res?.latestBlock ?? res?.height ?? 0),
        gasAvg: Number(res?.gasAvg ?? 0),
        blockTimeMs: Number(res?.blockTimeMs ?? 0),
      };
    } catch {
      return { tps: 0, pending: 0, latestBlock: 0, gasAvg: 0, blockTimeMs: 0 };
    }
  },
  getBlockByNumber: async (numHexOrDec: string | number, includeTxObjects = true): Promise<any> => {
    // Try eth_getBlockByNumber first; accept hex string or decimal number
    const numHex =
      typeof numHexOrDec === "string" && numHexOrDec.startsWith("0x")
        ? numHexOrDec
        : "0x" + Number(numHexOrDec).toString(16);
    try {
      return await callRpc<any>("eth_getBlockByNumber", [numHex, includeTxObjects]);
    } catch {
      // Fallback to custom method if exposed
      try {
        return await callRpc<any>("block_getByNumber", [Number(numHexOrDec), includeTxObjects]);
      } catch {
        return null;
      }
    }
  },
  getBlockByHash: async (hash: string, includeTxObjects = true): Promise<any> =>
    callRpc("eth_getBlockByHash", [hash, includeTxObjects]),
  getBlockTxCountByNumber: async (numHexOrDec: string | number): Promise<string> => {
    const numHex =
      typeof numHexOrDec === "string" && numHexOrDec.startsWith("0x")
        ? numHexOrDec
        : "0x" + Number(numHexOrDec).toString(16);
    return callRpc("eth_getBlockTransactionCountByNumber", [numHex]);
  },
  getBlockTxCountByHash: async (hash: string): Promise<string> =>
    callRpc("eth_getBlockTransactionCountByHash", [hash]),
  getBlockReceipts: async (blockId: { numberHex?: string; hash?: string }): Promise<any[]> => {
    if (blockId.hash) return callRpc("eth_getBlockReceipts", [blockId.hash]);
    const numHex = blockId.numberHex ?? "latest";
    return callRpc("eth_getBlockReceipts", [numHex]);
  },

  // Transactions
  getTransactionByBlockNumberAndIndex: async (numHexOrDec: string | number, indexHex: string): Promise<any> => {
    const numHex =
      typeof numHexOrDec === "string" && numHexOrDec.startsWith("0x")
        ? numHexOrDec
        : "0x" + Number(numHexOrDec).toString(16);
    return callRpc("eth_getTransactionByBlockNumberAndIndex", [numHex, indexHex]);
  },
  getTransactionByBlockHashAndIndex: async (hash: string, indexHex: string): Promise<any> =>
    callRpc("eth_getTransactionByBlockHashAndIndex", [hash, indexHex]),
  getTransactionCount: async (address: string, tag: string = "latest"): Promise<string> =>
    callRpc("eth_getTransactionCount", [address, tag]),
  ethCall: async (tx: Record<string, any>, tag: string = "latest"): Promise<string> =>
    callRpc("eth_call", [tx, tag]),
  estimateGas: async (tx: Record<string, any>): Promise<string> =>
    callRpc("eth_estimateGas", [tx]),

  // Accounts & State
  getBalance: async (address: string, tag: string = "latest"): Promise<string> =>
    callRpc("eth_getBalance", [address, tag]),
  getStorageAt: async (address: string, positionHex: string, tag: string = "latest"): Promise<string> =>
    callRpc("eth_getStorageAt", [address, positionHex, tag]),

  // Gas & Fees
  gasPrice: async (): Promise<string> => callRpc("eth_gasPrice", []),
  feeHistory: async (blockCountHex: string, newestBlock: string = "latest", rewardPercentiles: number[] = []): Promise<any> =>
    callRpc("eth_feeHistory", [blockCountHex, newestBlock, rewardPercentiles]),
  maxPriorityFeePerGas: async (): Promise<string> => callRpc("eth_maxPriorityFeePerGas", []),
  bigBlockGasPrice: async (): Promise<string> => callRpc("eth_bigBlockGasPrice", []),

  // Hyperliquid system
  getSystemTxsByBlockNumber: async (numHexOrDec: string | number): Promise<any[]> => {
    const numHex =
      typeof numHexOrDec === "string" && numHexOrDec.startsWith("0x")
        ? numHexOrDec
        : "0x" + Number(numHexOrDec).toString(16);
    return callRpc("eth_getSystemTxsByBlockNumber", [numHex]);
  },
  getSystemTxsByBlockHash: async (hash: string): Promise<any[]> =>
    callRpc("eth_getSystemTxsByBlockHash", [hash]),
};


