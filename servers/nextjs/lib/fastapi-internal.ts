/**
 * FastAPI internal URL resolution and auth headers for PresentOn Render deployment.
 * Used by Next.js server-side route handlers to call the FastAPI backend.
 */

export function getFastApiBaseUrl(): string {
  const internal = process.env.FAST_API_INTERNAL_URL?.trim();
  if (internal) {
    return internal.replace(/\/+$/, "");
  }
  
  const presenton = process.env.PRESENTON_BASE_URL?.trim();
  if (presenton) {
    return presenton.replace(/\/+$/, "");
  }

  const configured = process.env.NEXT_PUBLIC_FAST_API?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  
  return "http://127.0.0.1:8000";
}

/**
 * Auth headers for FastAPI calls from Next.js route handlers.
 * Uses PRESENTON_AUTH_USERNAME / PRESENTON_AUTH_PASSWORD for Basic Auth.
 */
export function getFastApiAuthHeaders(): Record<string, string> {
  const user = process.env.PRESENTON_AUTH_USERNAME?.trim() || process.env.AUTH_USERNAME?.trim();
  const pass = process.env.PRESENTON_AUTH_PASSWORD?.trim() || process.env.AUTH_PASSWORD?.trim();
  
  if (user && pass) {
    const encoded = Buffer.from(`${user}:${pass}`, "utf8").toString("base64");
    return { Authorization: `Basic ${encoded}` };
  }

  return {};
}
