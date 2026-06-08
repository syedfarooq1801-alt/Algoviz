import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlgoVis — Master DSA Visually",
  description: "Premium AI-powered DSA preparation platform with animated visualizations, pattern-based learning, and interview prep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
