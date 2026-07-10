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
  metadataBase: new URL("https://germanflash.vercel.app"),
  title: {
    default: "germanflash",
    template: "%s · germanflash",
  },
  description: "Learn German A1 vocabulary with spaced repetition. Free, no ads, no signup wall — just a magic link.",
  keywords: ["German", "A1", "flashcards", "spaced repetition", "SM-2", "language learning"],
  authors: [{ name: "Sanket Joshi" }],
  openGraph: {
    title: "germanflash",
    description: "Learn German A1 vocabulary with spaced repetition.",
    url: "https://germanflash.vercel.app",
    siteName: "germanflash",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "germanflash",
    description: "Learn German A1 vocabulary with spaced repetition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
