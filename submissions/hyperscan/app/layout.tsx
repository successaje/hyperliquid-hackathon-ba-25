import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "HyperScan",
  description: "Next-generation Hyperliquid explorer powered by Lava RPC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={["light","dark"]}>
          <Header />
          <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}


