import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prompt, size = "1024x1024" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Use Pollinations AI for free, keyless on-demand image generation
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(prompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
      
      return NextResponse.json({
        url: imageUrl,
        model: "pollinations-ai",
        prompt,
      });
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "hd",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        { error: err.error?.message || "Image generation failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    return NextResponse.json({ url: imageUrl, model: "dall-e-3", prompt });
  } catch (error: any) {
    console.error("[Image API Error]:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
