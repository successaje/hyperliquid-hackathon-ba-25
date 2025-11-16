"use client";

import { useCallback, useRef } from "react";
import { useExplorerStore } from "../lib/store";
import { ExplorerBlock, ExplorerTx } from "../utils/types";
import { Lava } from "../lib/lavaClient";

export function useRealtime() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { setBlocks, setTxs, setPendingTxs, setMetrics } = useExplorerStore();

  const poll = useCallback(async () => {
    try {
      // Derive latest blocks & txs from standard eth_* calls
      const latestNum = await Lava.blockNumber();

      const blockPromises: Promise<any>[] = [];
      const windowSize = 10;
      for (let i = 0; i < windowSize; i++) {
        const height = latestNum - i;
        if (height < 0) break;
        blockPromises.push(Lava.getBlockByNumber(height, true));
      }
      const rawBlocks = (await Promise.all(blockPromises)).filter(Boolean);

      const blocks: ExplorerBlock[] = rawBlocks.map((b: any) => {
        const tsMs = b.timestamp ? parseInt(b.timestamp, 16) * 1000 : Date.now();
        return {
          height: Number(b.number ? parseInt(b.number, 16) : 0),
          hash: String(b.hash ?? b.blockHash ?? "0x"),
          timestamp: new Date(tsMs).toISOString(),
        };
      });

      const txs: ExplorerTx[] = rawBlocks.flatMap((b: any) => {
        const tsMs = b.timestamp ? parseInt(b.timestamp, 16) * 1000 : Date.now();
        if (Array.isArray(b.transactions)) {
          return b.transactions.map((t: any) => {
            const hash = typeof t === "string" ? t : t?.hash;
            if (!hash) return null;
            return {
              hash,
              type: "tx",
              timestamp: new Date(tsMs).toISOString(),
            } as ExplorerTx;
          }).filter(Boolean) as ExplorerTx[];
        }
        return [];
      });

      // No pending txs without a mempool-specific RPC; leave empty for now
      setBlocks(blocks);
      setTxs(txs.slice(0, 50));
      setPendingTxs([]);
      // Derive basic metrics: TPS, latest block, avg gas
      if (rawBlocks.length) {
        const timestamps = rawBlocks
          .map((b: any) => (b.timestamp ? parseInt(b.timestamp, 16) * 1000 : undefined))
          .filter((v: any) => typeof v === "number") as number[];
        const totalTxs = txs.length;
        let tps = 0;
        let blockTimeMs = 0;
        if (timestamps.length >= 2) {
          const min = Math.min(...timestamps);
          const max = Math.max(...timestamps);
          const spanSec = (max - min) / 1000;
          if (spanSec > 0) {
            tps = totalTxs / spanSec;
            blockTimeMs = (spanSec / rawBlocks.length) * 1000;
          } else {
            tps = totalTxs;
          }
        }
        // Avg gas per tx
        let gasUsedTotal = 0;
        rawBlocks.forEach((b: any) => {
          const gu = b.gasUsed || b.gas_used;
          if (typeof gu === "string" && gu.startsWith("0x")) {
            gasUsedTotal += parseInt(gu, 16);
          } else if (typeof gu === "number") {
            gasUsedTotal += gu;
          }
        });
        const gasAvg = totalTxs > 0 ? gasUsedTotal / totalTxs : 0;
        setMetrics({
          tps: Number.isFinite(tps) ? Number(tps.toFixed(2)) : 0,
          pending: 0,
          latestBlock: latestNum,
          gasAvg: Math.round(gasAvg),
          blockTimeMs: Number.isFinite(blockTimeMs) ? blockTimeMs : 0,
        });
      }
    } catch (e) {
      // swallow errors in polling
    }
  }, [setBlocks, setTxs, setPendingTxs, setMetrics]);

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


