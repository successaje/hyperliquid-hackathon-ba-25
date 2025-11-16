import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) {
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    // Slither-like normalized response (static for now; replace with real service later)
    const response = {
      address,
      healthScore: 82,
      checks: [
        {
          id: "reentrancy",
          label: "Reentrancy protections in place",
          passed: true,
          severity: "high",
        },
        {
          id: "access-control",
          label: "Admin functions are access controlled",
          passed: true,
          severity: "high",
        },
        {
          id: "integer",
          label: "Integer operations guarded by Solidity checks",
          passed: true,
          severity: "medium",
        },
        {
          id: "upgradeability",
          label: "Upgradeable pattern detected; review upgrade admin and storage layout",
          passed: false,
          severity: "high",
          info: "Proxy-like behavior without explicit storage gap pattern.",
        },
      ],
    };

    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "slither simulation error" }, { status: 500 });
  }
}


