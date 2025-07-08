// /src/app/api/ai/feedback/cohere/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command", // or use "command-light"
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    return NextResponse.json({ text: result.generations?.[0]?.text || "No response." });
  } catch (error) {
    console.error("Cohere API Error:", error);
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
