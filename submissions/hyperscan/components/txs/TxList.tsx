import { ExplorerTx } from "../../utils/types";
import { formatDistanceToNowStrict } from "../../utils/format";

export function TxList({ txs }: { txs: ExplorerTx[] }) {
  if (!txs?.length) {
    return <div className="text-foreground opacity-60 text-sm">No transactions yet.</div>;
  }
  return (
    <ul className="divide-y divide-white/5">
      {txs.map((t) => (
        <li key={t.hash} className="py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-xs text-foreground opacity-60">{t.hash.slice(0, 14)}…</div>
            <div className="text-xs">{t.type ?? "tx"}</div>
          </div>
          <div className="text-xs text-foreground opacity-60">
            {formatDistanceToNowStrict(new Date(t.timestamp))}
          </div>
        </li>
      ))}
    </ul>
  );
}


