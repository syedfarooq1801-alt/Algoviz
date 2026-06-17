import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import CommandPalette from "@/components/CommandPalette";
import MobileNav from "@/components/MobileNav";

const inter = Inter({
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
  title: "AlgoVis — Master DSA & System Design",
  description: "A clean, focused platform to learn data structures, algorithms, and system design through visual intuition and deliberate practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CommandPalette />
          <div className="pb-16 lg:pb-0">{children}</div>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
