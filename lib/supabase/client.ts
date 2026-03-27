import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/supabase/types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;
const STORAGE_PREFERENCE_KEY = "resume_auth_storage_preference_v1";

type StoragePreference = "local" | "session";

function isBrowser() {
  return typeof window !== "undefined";
}

function getPreferredStorage(): StoragePreference {
  if (!isBrowser()) {
    return "local";
  }

  const stored = window.localStorage.getItem(STORAGE_PREFERENCE_KEY);
  return stored === "session" ? "session" : "local";
}

function getPrimaryStorage(): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  return getPreferredStorage() === "session" ? window.sessionStorage : window.localStorage;
}

function getSecondaryStorage(): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  return getPreferredStorage() === "session" ? window.localStorage : window.sessionStorage;
}

const dynamicStorage = {
  getItem(key: string) {
    if (!isBrowser()) {
      return null;
    }

    return getPrimaryStorage()?.getItem(key) ?? getSecondaryStorage()?.getItem(key) ?? null;
  },
  setItem(key: string, value: string) {
    getPrimaryStorage()?.setItem(key, value);
    getSecondaryStorage()?.removeItem(key);
  },
  removeItem(key: string) {
    if (!isBrowser()) {
      return;
    }

    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

export function setAuthStoragePersistence(remember: boolean) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_PREFERENCE_KEY, remember ? "local" : "session");
}

export function clearAuthStoragePersistence() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_PREFERENCE_KEY);
}

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        auth: {
          storage: dynamicStorage,
        },
      },
    );
  }

  return browserClient;
}
