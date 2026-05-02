import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UNIVAE — Cosmic Chat",
  description: "Chat with UNIVAE — powered by GPT-4o, Gemini, Claude, and Grok across infinite dimensions",
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-background">
      {children}
    </div>
  );
}
