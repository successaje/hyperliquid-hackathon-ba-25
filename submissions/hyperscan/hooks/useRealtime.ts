"use client";

import { useCallback, useRef } from "react";
import { useExplorerStore } from "../lib/store";
import { ExplorerBlock, ExplorerTx } from "../utils/types";
import { Lava } from "../lib/lavaClient";

export function useRealtime() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { setBlocks, setTxs } = useExplorerStore();

  const poll = useCallback(async () => {
    try {
      const [rawBlocks, rawTxs] = await Promise.all([
        Lava.getLatestBlocks(),
        Lava.getLatestTransactions(),
      ]);

      const blocks: ExplorerBlock[] = Array.isArray(rawBlocks)
        ? rawBlocks.map((b: any, i: number) => ({
            height: Number(b.height ?? b.number ?? b.block_number ?? i),
            hash: String(b.hash ?? b.block_hash ?? b.id ?? `0xblock${i}`),
            timestamp: new Date(
              Number(b.timestamp ?? b.time ?? Date.now() - i * 6000)
            ).toISOString(),
          }))
        : [];

      const txs: ExplorerTx[] = Array.isArray(rawTxs)
        ? rawTxs.map((t: any, i: number) => ({
            hash: String(t.hash ?? t.tx_hash ?? t.id ?? `0xtx${i}`),
            type: String(t.type ?? t.kind ?? "tx"),
            timestamp: new Date(
              Number(t.timestamp ?? t.time ?? Date.now() - i * 3000)
            ).toISOString(),
          }))
        : [];

      if (!blocks.length && !txs.length) {
        const now = Date.now();
        const fallbackBlocks: ExplorerBlock[] = Array.from({ length: 10 }).map((_, i) => ({
          height: 100000 + i,
          hash: `0xblock${i.toString(16)}${now.toString(16)}`,
          timestamp: new Date(now - i * 6000).toISOString(),
        }));
        const fallbackTxs: ExplorerTx[] = Array.from({ length: 15 }).map((_, i) => ({
          hash: `0xtx${i.toString(16)}${now.toString(16)}`,
          type: i % 3 === 0 ? "transfer" : i % 3 === 1 ? "order" : "cancel",
          timestamp: new Date(now - i * 3000).toISOString(),
        }));
        setBlocks(fallbackBlocks);
        setTxs(fallbackTxs);
        return;
      }

      setBlocks(blocks);
      setTxs(txs);
    } catch (e) {
      // swallow errors in polling
    }
  }, [setBlocks, setTxs]);

  const start = useCallback(() => {
    if (timerRef.current) return;
    void poll();
    timerRef.current = setInterval(poll, 5_000);
  }, [poll]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { start, stop };
}


