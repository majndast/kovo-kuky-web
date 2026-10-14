"use client";

import { useSyncExternalStore } from "react";

/**
 * Cookie consent, stored in localStorage.
 *  - "all":       analytics (Google Analytics) allowed
 *  - "necessary": only strictly necessary cookies
 *  - null:        no decision yet (or older than one year), so the banner shows
 */
export type Consent = "all" | "necessary" | null;

const KEY = "cookie-consent";
const TS_KEY = "cookie-consent-ts";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const listeners = new Set<() => void>();
let settingsOpen = false;
const emit = () => listeners.forEach((l) => l());

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== "all" && v !== "necessary") return null;
    const ts = Number(localStorage.getItem(TS_KEY) ?? 0);
    if (ts && Date.now() - ts > MAX_AGE_MS) return null;
    return v;
  } catch {
    return null;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function setConsent(value: "all" | "necessary") {
  try {
    localStorage.setItem(KEY, value);
    localStorage.setItem(TS_KEY, String(Date.now()));
  } catch {
    /* storage blocked: the choice only lives for this page view */
  }
  settingsOpen = false;
  emit();
}

export function openCookieSettings() {
  settingsOpen = true;
  emit();
}

export function useConsent() {
  // server snapshot is `undefined` so nothing consent related renders before hydration
  const consent = useSyncExternalStore<Consent | undefined>(subscribe, read, () => undefined);
  const open = useSyncExternalStore(subscribe, () => settingsOpen, () => false);
  return { consent, settingsOpen: open };
}
