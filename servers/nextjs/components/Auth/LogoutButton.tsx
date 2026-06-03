"use client";

import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  label?: string;
  className?: string;
  iconOnly?: boolean;
};

export default function LogoutButton({
  label = "Logout",
  className = "",
  iconOnly = false,
}: LogoutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const handleLogout = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // Always route back to auth gate even if sign-out fails.
    } finally {
      window.location.replace("/");
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className={className}
      aria-label={label}
      title={label}
    >
      <LogOut className="h-4 w-4" />
      {!iconOnly ? <span>{isSubmitting ? "Signing out..." : label}</span> : null}
    </button>
  );
}
