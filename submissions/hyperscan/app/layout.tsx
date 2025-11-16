import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "../components/Header";

export const metadata: Metadata = {
  title: "HyperScan",
  description: "Next-generation Hyperliquid explorer powered by Lava RPC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


