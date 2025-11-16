"use client";

import { useEffect, useMemo, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
  const [envReady, setEnvReady] = useState(false);
  const [canInjected, setCanInjected] = useState(false);

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    const eth: any = hasWindow ? (window as any).ethereum : null;
    setEnvReady(Boolean(appId));
    setCanInjected(Boolean(eth) && typeof eth?.on === "function");
  }, [appId]);

  const config = useMemo(
    () =>
      canInjected
        ? {
            appearance: { theme: "dark" as const },
            embeddedWallets: { createOnLogin: "users-without-wallets" as const },
          }
        : {
            appearance: { theme: "dark" as const },
            // Force embedded/email flow if no proper injected provider is available
            loginMethods: ["email"] as const,
            embeddedWallets: { createOnLogin: "users-without-wallets" as const },
          },
    [canInjected]
  );

  if (!envReady) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider appId={appId} config={config}>
      {children}
    </PrivyProvider>
  );
}


