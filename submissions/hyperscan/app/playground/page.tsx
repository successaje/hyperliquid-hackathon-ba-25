"use client";

import { useState } from "react";

export default function PlaygroundPage() {
  const [method, setMethod] = useState("eth_blockNumber");
  const [params, setParams] = useState("[]");
  const [output, setOutput] = useState<string>("");

  const send = async () => {
    try {
      const res = await fetch("/api/lava", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ method, params: JSON.parse(params || "[]") }),
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (e: any) {
      setOutput(e?.message ?? "Error");
    }
  };

  const curl = `curl -X POST -H 'content-type: application/json' -d '${JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method,
    params: (() => { try { return JSON.parse(params || "[]"); } catch { return []; } })(),
  })}' ${location.origin}/api/lava`;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">API Playground</h1>
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm">
            Method
            <input className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={method} onChange={(e) => setMethod(e.target.value)} />
          </label>
          <label className="text-sm">
            Params (JSON)
            <input className="mt-1 w-full px-3 py-2 rounded border border-white/10 bg-transparent" value={params} onChange={(e) => setParams(e.target.value)} />
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={send} className="px-3 py-2 rounded border border-white/10 hover:border-white/20">Send Request</button>
          <button onClick={() => navigator.clipboard.writeText(curl)} className="px-3 py-2 rounded border border-white/10 hover:border-white/20">Copy cURL</button>
        </div>
        <pre className="text-xs overflow-auto max-h-[420px]">{output}</pre>
      </div>
    </div>
  );
}


