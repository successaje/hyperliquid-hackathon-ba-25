export type ExplorerBlock = {
  height: number;
  hash: string;
  timestamp: string; // ISO
};

export type ExplorerTx = {
  hash: string;
  type?: string;
  timestamp: string; // ISO
};


