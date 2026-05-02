// UNIVAE — Type Definitions

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
  model?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: SerializedMessage[];
  model: string;
  mode: ChatMode;
  createdAt: Date;
  updatedAt: Date;
}

// Messages stored in conversation history (simplified, not UIMessage)
export interface SerializedMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string; // ISO string for localStorage serialization
}

export type ChatMode =
  | "general"
  | "creative"
  | "precise"
  | "coding"
  | "academic"
  | "fun"
  | "image"
  | "video";

export interface ModelConfig {
  id: string;
  name: string;
  provider: "openai" | "google" | "anthropic" | "xai";
  description: string;
  maxTokens: number;
  icon: string;
  color: string;
}

export interface ChatSettings {
  model: string;
  mode: ChatMode;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  model: string;
  createdAt: Date;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  url: string;
  model: string;
  status: "pending" | "generating" | "completed" | "failed";
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  avatar: string; // emoji or initials
  plan: "Explorer" | "Pro" | "Cosmic";
  email?: string;
}
