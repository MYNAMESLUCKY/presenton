import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AuthStatus = {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
};

/**
 * Check Supabase auth status from server components.
 */
export async function getServerAuthStatus(): Promise<AuthStatus> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return {
      authenticated: !!user,
      userId: user?.id ?? null,
      email: user?.email ?? null,
    };
  } catch {
    return {
      authenticated: false,
      userId: null,
      email: null,
    };
  }
}

/**
 * Require an authenticated Supabase session.
 * If not authenticated, redirect to the login page (root /).
 */
export async function requireAppSession() {
  const status = await getServerAuthStatus();
  if (!status.authenticated) {
    redirect("/?reason=unauthorized");
  }
}
