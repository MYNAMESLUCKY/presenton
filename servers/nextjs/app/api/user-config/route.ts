import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/user-config
 * Returns the env-var-driven LLM configuration.
 * With CAN_CHANGE_KEYS=false, users cannot modify this config.
 */
export async function GET() {
  return NextResponse.json({
    LLM: process.env.LLM || "custom",
    CUSTOM_LLM_URL: process.env.CUSTOM_LLM_URL || "",
    CUSTOM_MODEL: process.env.CUSTOM_MODEL || "",
    IMAGE_PROVIDER: process.env.IMAGE_PROVIDER || "pexels",
    DISABLE_IMAGE_GENERATION: process.env.DISABLE_IMAGE_GENERATION === "true",
    // Note: API keys are NOT exposed to the client
  });
}

/**
 * POST /api/user-config
 * In env-var-driven mode, config changes are not allowed.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Configuration changes are disabled. LLM settings are managed via environment variables." },
    { status: 403 }
  );
}
