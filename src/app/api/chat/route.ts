import { streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { xai } from "@ai-sdk/xai";
import { NextRequest } from "next/server";

export const maxDuration = 60;

function getProvider(modelId: string) {
  if (modelId.startsWith("gpt-") || modelId.startsWith("o1") || modelId.startsWith("o3")) {
    return openai(modelId);
  }
  if (modelId.startsWith("gemini-")) {
    return google(modelId);
  }
  if (modelId.startsWith("claude-")) {
    return anthropic(modelId);
  }
  if (modelId.startsWith("grok-")) {
    return xai(modelId);
  }
  return google("gemini-2.5-flash");
}

// Convert UIMessage (parts-based) to standard { role, content } format
function convertMessages(messages: UIMessage[]) {
  return messages.map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join(""),
  }));
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model, systemPrompt, temperature, maxTokens } = await req.json();

    const provider = getProvider(model || "gemini-2.5-flash");

    // Convert UIMessage parts format to standard content format
    const convertedMessages = convertMessages(messages);

    const result = streamText({
      model: provider,
      system:
        systemPrompt ||
        "You are UNIVAE, a cosmic intelligence that transcends boundaries. Be helpful, accurate, and insightful. Use markdown formatting when appropriate. You were created by UNIVAE.",
      messages: convertedMessages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      maxOutputTokens: typeof maxTokens === "number" ? maxTokens : 4096,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("[Chat API Error]:", error);

    if (error?.message?.includes("API key")) {
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please add the required API key to your environment variables.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: error?.message || "An error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
