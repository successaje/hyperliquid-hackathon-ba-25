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
  getAddress: async (address: string): Promise<any> => {
    try {
      return await callRpc<any>("address_get", [address]);
    } catch (e) {
      return { address, note: "address_get not implemented in placeholder" };
    }
  },
  getTransaction: async (hash: string): Promise<any> => {
    try {
      return await callRpc<any>("tx_get", [hash]);
    } catch (e) {
      return { hash, note: "tx_get not implemented in placeholder" };
    }
  },
  getContract: async (address: string): Promise<any> => {
    try {
      return await callRpc<any>("contract_get", [address]);
    } catch (e) {
      return { address, note: "contract_get not implemented in placeholder" };
    }
  },
};


