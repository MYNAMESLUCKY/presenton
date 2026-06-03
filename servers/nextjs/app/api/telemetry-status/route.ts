import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // In Render deployment, telemetry is controlled via env vars only
  const envDisabled =
    process.env.DISABLE_ANONYMOUS_TRACKING === "true" ||
    process.env.DISABLE_ANONYMOUS_TRACKING === "True";
  const telemetryEnabled = !envDisabled;
  return NextResponse.json({ telemetryEnabled });
}
