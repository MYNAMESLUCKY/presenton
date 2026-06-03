import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/has-required-key
 * Checks environment variables directly for required LLM API keys.
 */
export async function GET() {
  // Check for any configured LLM API key
  const hasKey = Boolean(
    (process.env.OPENAI_API_KEY || "").trim() ||
    (process.env.CUSTOM_LLM_API_KEY || "").trim() ||
    (process.env.GOOGLE_API_KEY || "").trim() ||
    (process.env.ANTHROPIC_API_KEY || "").trim()
  );

  return NextResponse.json({ hasKey });
}
