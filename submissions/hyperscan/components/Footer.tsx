export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold">HyperScan</div>
          <div className="opacity-70">Lava-powered Hyperliquid explorer</div>
        </div>
        <div className="opacity-80 space-y-1">
          <a className="block hover:underline" href="/tokens">Tokens</a>
          <a className="block hover:underline" href="/contracts">Contracts</a>
          <a className="block hover:underline" href="/playground">API Playground</a>
          <a className="block hover:underline" href="/bridge">Bridge</a>
        </div>
        <div className="opacity-80 space-y-1">
          <div>Inspired by premium explorers like <a className="underline" href="https://zetascan.com" target="_blank" rel="noreferrer">ZetaScan</a></div>
          <div>© {new Date().getFullYear()} HyperScan</div>
        </div>
      </div>
    </footer>
  );
}


