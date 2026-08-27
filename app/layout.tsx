import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Companies — AI Orbit",
  description: "Explore the labs, startups, and infrastructure companies shaping the future of artificial intelligence.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
