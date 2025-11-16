import { create } from "zustand";
import { ExplorerBlock, ExplorerTx } from "../utils/types";

type ExplorerState = {
  latestBlocks: ReadonlyArray<ExplorerBlock>;
  latestTxs: ReadonlyArray<ExplorerTx>;
  setBlocks: (blocks: ReadonlyArray<ExplorerBlock>) => void;
  setTxs: (txs: ReadonlyArray<ExplorerTx>) => void;
};

export const useExplorerStore = create<ExplorerState>((set) => ({
  latestBlocks: [],
  latestTxs: [],
  setBlocks: (blocks) =>
    set(() => ({
      latestBlocks: blocks.slice(0, 30),
    })),
  setTxs: (txs) =>
    set(() => ({
      latestTxs: txs.slice(0, 50),
    })),
}));


