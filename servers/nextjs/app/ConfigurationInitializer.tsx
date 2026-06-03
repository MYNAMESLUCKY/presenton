'use client';

import { useEffect, useState } from 'react';
import { setCanChangeKeys, setLLMConfig } from '@/store/slices/userConfig';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { LLMConfig } from '@/types/llm_config';

/**
 * ConfigurationInitializer - Simplified for Render deployment.
 * 
 * With CAN_CHANGE_KEYS=false (env-driven LLM config), this component:
 * 1. Sets canChangeKeys to false
 * 2. Fetches the env-based LLM config from /api/user-config
 * 3. Routes authenticated users to /upload
 */
export function ConfigurationInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const route = usePathname();
  const [isLoading, setIsLoading] = useState(
    () => !route?.startsWith("/pdf-maker")
  );
  const router = useRouter();

  useEffect(() => {
    fetchUserConfigState();
  }, []);

  const setLoadingToFalseAfterNavigatingTo = (pathname: string) => {
    const interval = setInterval(() => {
      if (window.location.pathname === pathname) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 500);
  }

  const fetchUserConfigState = async () => {
    if (route.startsWith("/pdf-maker")) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // In Render deployment, keys are managed via env vars
    const canChangeKeys = false;
    dispatch(setCanChangeKeys(canChangeKeys));

    // Fetch the env-based LLM config
    let llmConfig: LLMConfig = {};
    try {
      const res = await fetch('/api/user-config');
      llmConfig = await res.json();
    } catch (e) {
      console.error('Failed to fetch user config:', e);
      llmConfig = {};
    }

    if (!llmConfig.LLM) {
      llmConfig.LLM = 'custom';
    }

    dispatch(setLLMConfig(llmConfig));

    // Route to upload if on root
    if (route === '/' || route === '/upload') {
      if (route === '/') {
        router.push('/upload');
        setLoadingToFalseAfterNavigatingTo('/upload');
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[#EDEEEF] bg-white p-8 text-center shadow-xl">
            {/* Logo/Branding */}
            <div className="mb-6">
              <img
                src="/Logo.png"
                alt="PresentOn"
                className="mx-auto mb-4 h-12 opacity-90"
              />
              <div className="mx-auto h-1 w-16 rounded-full bg-[#7C51F8]" />
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 font-inter">
                Initializing Application
              </h3>
              <p className="text-sm text-gray-600 font-inter">
                Loading configuration...
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
