export type KnownToken = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
};

// Hyperliquid testnet tokens (from docs)
export const HYPER_TOKENS: KnownToken[] = [
  {
    symbol: "MBTC",
    name: "mockBTC",
    address: "0x453b63484b11bbF0b61fC7E854f8DAC7bdE7d458",
    decimals: 18,
  },
  {
    symbol: "HPSX",
    name: "Hyperswap LP",
    address: "0xddA44A39AaA3e2dcc8aFd78ca70b0718877188b5",
    decimals: 18,
  },
  {
    symbol: "USDC",
    name: "USD Coin (test)",
    address: "0x6fDbAF3102eFC67ceE53EeFA4197BE36c8E1A094",
    decimals: 6,
  },
  {
    symbol: "sUSDe",
    name: "Staked USDe",
    address: "0x2222C34A8dd4Ea29743bf8eC4fF165E059839782",
    decimals: 18,
  },
  {
    symbol: "WETH",
    name: "Wrapped ETH",
    address: "0xADcb2f358Eae6492F61A5F87eb8893d09391d160",
    decimals: 18,
  },
];


