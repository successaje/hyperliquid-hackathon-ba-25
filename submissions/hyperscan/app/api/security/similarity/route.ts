import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    // Similarity scan stub – in a full setup this would query a precomputed index
    // of contracts and their bytecode hashes / Slither fingerprints.
    const similar = [
      {
        address: "0xa7C94d8F1B3E92b1c2DF8B014f61B4fC51b77D93",
        similarity: 96,
        label: "High-probability clone — matches 94% of bytecode",
        risk: "high" as const,
        notes: "Contract shares identical function selectors and storage layout. Likely redeployed fork.",
      },
      {
        address: "0x4F2b3a81E0C7c145672F4A4A8e880f5Dd3E9217D",
        similarity: 89,
        label: "Fork of common protocol base (Sudoswap template)",
        risk: "medium" as const,
        notes: "Inherits proxy-safe functions; differs mainly in fee logic. Known pattern.",
      },
      {
        address: "0x9eB1F948c6e7F54742A1E6A9b535cA3Fbc18A0a8",
        similarity: 74,
        label: "Shares upgradeability + AdminOwnable structure",
        risk: "medium" as const,
        notes: "Detected UUPS-style upgrade hooks. Admin role not renounced.",
      },
      {
        address: "0x18C3Faab9f7AD5602dDaBE6123421F58c6B2c030",
        similarity: 61,
        label: "Partial match — common utility libs",
        risk: "low" as const,
        notes: "Uses standard SafeMath-like operations and ERC20 helpers.",
      },
      {
        address: "0xfF0b21ba49E80A13Ff2c98A8E88e7F941b6c52a1",
        similarity: 42,
        label: "Similar ABI shape, no bytecode relationship",
        risk: "low" as const,
        notes: "Structurally similar, but not an actual fork or clone. Likely coincidence.",
      }
    ];
    

    return NextResponse.json({ address, similar });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "similarity scan error" }, { status: 500 });
  }
}


