import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params } = body ?? {};
    if (!method) {
      return NextResponse.json({ error: "method required" }, { status: 400 });
    }

    const envUrl = process.env.LAVA_HYPERLIQUID_RPC_URL;
    const apiKey = process.env.LAVA_API_KEY;
    const url = envUrl || "";
    if (!url) {
      return NextResponse.json(
        { error: "LAVA_HYPERLIQUID_RPC_URL not configured" },
        { status: 500 }
      );
    }

    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    if (apiKey && !url.includes(apiKey)) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params: params ?? [],
      }),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}


