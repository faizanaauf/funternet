import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Funternet Arcade | The Internet Is Full of Information. We Make It Playable.",
  description:
    "Funternet Arcade transforms boring articles, Terms & Conditions, notes, and topics into interactive AI-generated games, boss battles, and trivia quests.",
  keywords: [
    "hackathon",
    "funternet arcade",
    "gamify",
    "gemini api",
    "ai games",
    "interactive learning",
    "boss battle",
  ],
  authors: [{ name: "Funternet Arcade Team" }],
  openGraph: {
    title: "Funternet Arcade | Make Internet Fun",
    description: "The internet is full of information. We make it playable.",
    siteName: "Funternet Arcade",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-300 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
