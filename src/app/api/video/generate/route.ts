import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = "runway", duration = "5s" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check for Runway API key
    const runwayKey = process.env.RUNWAY_API_KEY;
    const klingKey = process.env.KLING_API_KEY;

    if (!runwayKey && !klingKey) {
      // Since true AI video generation requires heavy GPU compute and paid API keys,
      // we fallback to generating a highly accurate Pollinations AI image
      // and let the frontend animate it to simulate a video.
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(prompt);
      const fallbackImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;

      return NextResponse.json({
        url: null,
        fallbackImage: fallbackImageUrl,
        status: "completed",
        model: "pollinations-simulated",
        prompt,
      });
    }

    // Runway ML integration
    if (model === "runway" && runwayKey) {
      const response = await fetch("https://api.runwayml.com/v1/image_to_video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${runwayKey}`,
          "Content-Type": "application/json",
          "X-Runway-Version": "2024-11-06",
        },
        body: JSON.stringify({
          model: "gen4_turbo",
          promptText: prompt,
          duration: parseInt(duration),
          ratio: "1280:720",
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        return NextResponse.json(
          { error: err.message || "Runway generation failed" },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json({ taskId: data.id, status: "pending", model: "runway" });
    }

    return NextResponse.json({
      error: "Requested model not configured. Please add the appropriate API key.",
    }, { status: 400 });
  } catch (error: any) {
    console.error("[Video API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
