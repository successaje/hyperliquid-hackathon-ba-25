export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs opacity-70">
        <div>HyperScan — Lava-powered Hyperliquid explorer</div>
        <div>© {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}


