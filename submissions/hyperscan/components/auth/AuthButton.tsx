"use client";

import { usePrivy } from "@privy-io/react-auth";

export function AuthButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  if (!ready) return null;
  return authenticated ? (
    <button onClick={logout} className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-sm">
      Logout {user?.wallet?.address?.slice(0, 6)}…
    </button>
  ) : (
    <button onClick={login} className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-sm">
      Login
    </button>
  );
}


