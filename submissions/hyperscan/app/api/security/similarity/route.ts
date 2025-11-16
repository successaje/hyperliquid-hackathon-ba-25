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
        address: "0x1111111111111111111111111111111111111111",
        similarity: 97,
        label: "Close clone on HyperEVM",
        risk: "high" as const,
      },
      {
        address: "0x2222222222222222222222222222222222222222",
        similarity: 88,
        label: "Forked from known protocol template",
        risk: "medium" as const,
      },
      {
        address: "0x3333333333333333333333333333333333333333",
        similarity: 72,
        label: "Shares upgradeability + admin pattern",
        risk: "medium" as const,
      },
    ];

    return NextResponse.json({ address, similar });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "similarity scan error" }, { status: 500 });
  }
}


