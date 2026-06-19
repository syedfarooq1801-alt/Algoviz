import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import CommandPalette from "@/components/CommandPalette";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlgoVis Studio — Interview Prep",
  description: "A focused platform for DSA, system design, CS fundamentals, mocks, and behavioral interview prep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`h-full ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('algovis-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full" style={{ background: "var(--bg-primary)" }}>
        <AuthProvider>
          <CommandPalette />
          <div className="lg:grid min-h-screen" style={{ gridTemplateColumns: "220px 1fr" }}>
            <Sidebar />
            <div className="pb-16 lg:pb-0 min-h-screen">{children}</div>
          </div>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
