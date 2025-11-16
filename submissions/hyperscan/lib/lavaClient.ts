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
};


