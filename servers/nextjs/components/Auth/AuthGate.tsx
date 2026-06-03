"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { notify } from "@/components/ui/sonner";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export default function AuthGate() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    void checkAuthStatus();
  }, []);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      isLoading ||
      !isAuthenticated ||
      isRedirecting
    ) {
      return;
    }

    setIsRedirecting(true);
    window.location.replace("/upload");
  }, [isLoading, isRedirecting, isAuthenticated]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedEmail = email.trim();
    if (!cleanedEmail || !cleanedEmail.includes("@")) {
      notify.warning(
        "Invalid email",
        "Please enter a valid email address."
      );
      return;
    }

    if (password.length < 6) {
      notify.warning(
        "Password too short",
        "Your password must be at least 6 characters."
      );
      return;
    }

    if (authMode === "signup" && password !== confirmPassword) {
      notify.warning(
        "Passwords do not match",
        "Make sure both password fields match before continuing."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanedEmail,
          password,
        });

        if (error) {
          notify.error("Sign-up failed", error.message);
          return;
        }

        if (data.user && !data.session) {
          // Email confirmation required
          notify.success(
            "Check your email",
            "We sent you a confirmation link. Please check your email to verify your account.",
            { duration: 8000 }
          );
          setAuthMode("login");
          setPassword("");
          setConfirmPassword("");
          return;
        }

        // Auto-confirmed (if email confirmation is disabled in Supabase)
        setIsAuthenticated(true);
        notify.success("Account created", "Welcome! Loading your workspace.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanedEmail,
          password,
        });

        if (error) {
          notify.error(
            "Sign-in failed",
            error.message === "Invalid login credentials"
              ? "The email or password is incorrect. Please try again."
              : error.message
          );
          return;
        }

        setIsAuthenticated(true);
        setPassword("");
        notify.success("Signed in", "Welcome back. Loading your workspace.");
      }
    } catch (submitError) {
      console.error(submitError);
      notify.error(
        "Login unavailable",
        "The login service is unavailable right now. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isRedirecting || isAuthenticated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6">
        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-2xl border border-[#EDEEEF] bg-white p-8 text-center shadow-xl">
            <Image
              src="/Logo.png"
              alt="Presenton"
              width={160}
              height={48}
              className="mx-auto mb-5 h-12 w-auto opacity-95"
              priority
            />
            <div className="mx-auto mb-4 h-1 w-16 rounded-full bg-[#7C51F8]" />
            <h1 className="font-syne text-lg font-semibold text-black">Presenton</h1>
            <p className="mt-3 font-syne text-sm text-[#000000CC]">Preparing your workspace…</p>
            <div className="mt-6 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#5146E5]" />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-[#7C51F8]"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-[#5146E5]"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6">
      <section className="relative z-10 w-full max-w-xl rounded-2xl border border-[#E1E1E5] bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-[4px] bg-[#F4F3FF] p-3">
              <Image
                src="/logo-with-bg.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div>
              <p className="font-syne text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A5AF8]">
                Secure instance
              </p>
              <h1 className="mt-1 font-syne text-2xl font-semibold leading-tight text-black sm:text-[26px]">
                {authMode === "signup" ? "Create your account" : "Sign in to continue"}
              </h1>
            </div>
          </div>
        </div>

        <p className="font-syne text-base text-[#000000CC] sm:text-lg">
          {authMode === "signup"
            ? "Create an account to start building beautiful presentations."
            : "Enter your credentials to open the presentation workspace."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-syne text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-[11px] border border-[#EDEEEF] bg-white px-4 py-3 font-syne text-sm text-black outline-none transition placeholder:text-[#999999] focus:border-[#a49cfc] focus:ring-2 focus:ring-[#5146E5]/20"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block font-syne text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-[11px] border border-[#EDEEEF] bg-white px-4 py-3 font-syne text-sm text-black outline-none transition placeholder:text-[#999999] focus:border-[#a49cfc] focus:ring-2 focus:ring-[#5146E5]/20"
              disabled={isSubmitting}
            />
          </div>

          {authMode === "signup" ? (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block font-syne text-sm font-medium text-black">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-[11px] border border-[#EDEEEF] bg-white px-4 py-3 font-syne text-sm text-black outline-none transition placeholder:text-[#999999] focus:border-[#a49cfc] focus:ring-2 focus:ring-[#5146E5]/20"
                disabled={isSubmitting}
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[58px] border border-[#EDEEEF] bg-[#7C51F8] px-5 py-3 font-syne text-xs font-semibold text-white transition hover:bg-[#6d46e6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? authMode === "signup"
                ? "Creating account…"
                : "Signing in…"
              : authMode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="font-syne text-sm text-[#7A5AF8] hover:underline"
            >
              {authMode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
