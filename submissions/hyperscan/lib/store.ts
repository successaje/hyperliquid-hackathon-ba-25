import { create } from "zustand";
import { ExplorerBlock, ExplorerTx } from "../utils/types";

type ExplorerState = {
  latestBlocks: ReadonlyArray<ExplorerBlock>;
  latestTxs: ReadonlyArray<ExplorerTx>;
  pendingTxs: ReadonlyArray<ExplorerTx>;
  metrics: {
    tps?: number;
    pending?: number;
    latestBlock?: number;
    gasAvg?: number;
    blockTimeMs?: number;
  };
  setBlocks: (blocks: ReadonlyArray<ExplorerBlock>) => void;
  setTxs: (txs: ReadonlyArray<ExplorerTx>) => void;
  setPendingTxs: (txs: ReadonlyArray<ExplorerTx>) => void;
  setMetrics: (m: Partial<ExplorerState["metrics"]>) => void;
};

export const useExplorerStore = create<ExplorerState>((set) => ({
  latestBlocks: [],
  latestTxs: [],
  pendingTxs: [],
  metrics: {},
  setBlocks: (blocks) =>
    set(() => ({
      latestBlocks: blocks.slice(0, 30),
    })),
  setTxs: (txs) =>
    set(() => ({
      latestTxs: txs.slice(0, 50),
    })),
  setPendingTxs: (txs) =>
    set(() => ({
      pendingTxs: txs.slice(0, 50),
    })),
  setMetrics: (m) =>
    set((s) => ({
      metrics: { ...s.metrics, ...m },
    })),
}));


