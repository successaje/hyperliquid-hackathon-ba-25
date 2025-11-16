import { ExplorerBlock } from "../../utils/types";
import { formatDistanceToNowStrict } from "../../utils/format";

export function BlockList({ blocks }: { blocks: ExplorerBlock[] }) {
  if (!blocks?.length) {
    return <div className="text-white/60 text-sm">No blocks yet.</div>;
  }
  return (
    <ul className="divide-y divide-white/5">
      {blocks.map((b) => (
        <li key={b.height} className="py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-primary font-semibold">#{b.height}</div>
            <div className="text-xs text-white/60">{b.hash.slice(0, 10)}…</div>
          </div>
          <div className="text-xs text-white/60">
            {formatDistanceToNowStrict(new Date(b.timestamp))}
          </div>
        </li>
      ))}
    </ul>
  );
}


