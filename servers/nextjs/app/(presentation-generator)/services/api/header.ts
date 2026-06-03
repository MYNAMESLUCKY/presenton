/**
 * API request headers for FastAPI backend calls.
 * Includes Basic Auth credentials from environment variables when available.
 */

function getBasicAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  // Browser-side: credentials are handled by the FastAPI's CORS / session cookies.
  // Basic Auth is only needed for server-to-server calls (handled in fastapi-internal.ts).
  return {};
}

export const getHeader = () => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...getBasicAuthHeader(),
  };
};

export const getHeaderForFormData = () => {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    ...getBasicAuthHeader(),
  };
};
