import { getAIProvider, testAIConnection } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider") as "gemini" | "openai" | null;

    const result = await testAIConnection(provider || undefined);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `❌ AI test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        provider: getAIProvider(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider, prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await testAIConnection(provider);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `❌ AI test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        provider: getAIProvider(),
      },
      { status: 500 }
    );
  }
}
