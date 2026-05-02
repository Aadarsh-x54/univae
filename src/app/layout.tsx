import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UNIVAE — The Cosmic Intelligence | Beyond the Universe",
  description:
    "UNIVAE is a transcendent AI platform. Chat with the universe's most powerful AI models, generate stunning cosmic art, create cinematic videos — all within one infinite, galactic experience.",
  keywords: [
    "AI chatbot",
    "UNIVAE",
    "artificial intelligence",
    "image generation",
    "video generation",
    "cosmic AI",
  ],
  authors: [{ name: "UNIVAE" }],
  openGraph: {
    title: "UNIVAE — The Cosmic Intelligence",
    description: "Beyond the Universe. Your transcendent AI companion powered by multiple cutting-edge models.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
