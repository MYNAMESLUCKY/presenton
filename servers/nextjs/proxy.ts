import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Supabase session management proxy for PresentOn.
 * Replaces the original FastAPI-based session auth with Supabase Auth.
 * 
 * Next.js 16 uses proxy.ts instead of middleware.ts.
 */

function createSupabaseProxyClient(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );
}

function isApiAuthExempt(pathname: string): boolean {
  return (
    pathname === "/api/telemetry-status" ||
    pathname === "/api/template" ||
    pathname === "/api/template/custom" ||
    pathname.startsWith("/api/export-presentation-data/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client and refresh the auth session
  const supabase = createSupabaseProxyClient(request, response);
  await supabase.auth.getUser();

  // Handle /pdf-maker session token passthrough
  if (pathname === "/pdf-maker") {
    return response;
  }

  // Skip auth checks for OPTIONS requests and exempt API routes
  if (request.method === "OPTIONS" || isApiAuthExempt(pathname)) {
    return response;
  }

  // For API routes, check authentication
  if (pathname.startsWith("/api/")) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { detail: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
