import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/can-change-keys
 * Always returns false for Render deployment (env-var-driven config).
 */
export async function GET() {
  return NextResponse.json({ canChange: false });
}