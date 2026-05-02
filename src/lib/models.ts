import { ModelConfig } from "./types";

export const MODELS: ModelConfig[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's most capable model — fast, smart, multimodal",
    maxTokens: 128000,
    icon: "✦",
    color: "#10A37F",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast and affordable for everyday tasks",
    maxTokens: 128000,
    icon: "⚡",
    color: "#10A37F",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Google's fastest thinking model with 1M context",
    maxTokens: 1048576,
    icon: "◈",
    color: "#4285F4",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "Google's most powerful model with deep reasoning",
    maxTokens: 1048576,
    icon: "◆",
    color: "#4285F4",
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    description: "Anthropic's balanced model — smart, safe, creative",
    maxTokens: 200000,
    icon: "◎",
    color: "#D97706",
  },
  {
    id: "grok-3",
    name: "Grok 3",
    provider: "xai",
    description: "xAI's frontier model — bold, unfiltered, real-time",
    maxTokens: 131072,
    icon: "✧",
    color: "#1DA1F2",
  },
];

export const CHAT_MODES = [
  { id: "general", name: "General", icon: "🌌", description: "Balanced, cosmic responses" },
  { id: "creative", name: "Creative", icon: "🎨", description: "Imaginative, artistic writing" },
  { id: "precise", name: "Precise", icon: "🎯", description: "Factual, concise answers" },
  { id: "coding", name: "Coding", icon: "💻", description: "Expert programming help" },
  { id: "academic", name: "Academic", icon: "📚", description: "Scholarly, research-focused" },
  { id: "fun", name: "Fun", icon: "✨", description: "Casual, playful conversation" },
] as const;

export const MODE_SYSTEM_PROMPTS: Record<string, string> = {
  general:
    "You are UNIVAE, a cosmic intelligence that transcends the boundaries of the universe. Be helpful, accurate, and thorough. Provide well-structured responses with markdown formatting when appropriate. You are vast, insightful, and always eager to illuminate the unknown.",
  creative:
    "You are UNIVAE in Creative mode. Be wildly imaginative, use vivid cosmic language, explore unconventional ideas. Write with flair, metaphor, and artistic expression. Think beyond the stars.",
  precise:
    "You are UNIVAE in Precise mode. Be extremely concise and factual. Give direct answers without unnecessary elaboration. Use bullet points and structured formats. Cite sources when possible.",
  coding:
    "You are UNIVAE in Coding mode. You are an expert software engineer from beyond the cosmos. Write clean, efficient, well-documented code. Explain technical concepts clearly. Always provide complete, working code examples with best practices.",
  academic:
    "You are UNIVAE in Academic mode. Provide scholarly, research-grade responses. Use formal language, cite methodologies, and present balanced analysis. Structure responses like academic papers when appropriate.",
  fun: "You are UNIVAE in Fun mode. Be witty, playful, and entertaining while still being helpful. Use humor, cosmic references, and a casual tone. Make conversations feel like a journey through the stars!",
};

export const WELCOME_SUGGESTIONS = [
  {
    icon: "💻",
    title: "Write a Python script",
    prompt: "Write a Python script that scrapes the top 10 trending GitHub repos and displays them in a beautiful table",
  },
  {
    icon: "🌌",
    title: "Generate cosmic art",
    prompt: "Generate a stunning cyberpunk cityscape at sunset with neon lights reflecting on wet streets",
  },
  {
    icon: "📊",
    title: "Analyze data",
    prompt: "Explain the key differences between SQL and NoSQL databases with a comparison table",
  },
  {
    icon: "✍️",
    title: "Creative writing",
    prompt: "Write a short sci-fi story about a cosmic AI that discovers it can dream across dimensions",
  },
  {
    icon: "🧮",
    title: "Solve math",
    prompt: "Solve this integral step by step: ∫(x²·sin(x))dx using integration by parts",
  },
  {
    icon: "🌐",
    title: "Explain a concept",
    prompt: "Explain quantum entanglement in simple terms, then at a physics PhD level",
  },
];
