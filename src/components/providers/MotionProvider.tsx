"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * Preferencia de movimiento del sitio.
 * `reduced` es verdadero si el sistema pide menos movimiento o si la persona
 * activó «Reducir movimiento» en la página. La preferencia se guarda en
 * localStorage (no es un dato sensible) y se refleja en <html data-motion>.
 */
type MotionPref = {
  reduced: boolean;
  userReduced: boolean;
  setUserReduced: (value: boolean) => void;
};

const MotionPrefContext = createContext<MotionPref>({
  reduced: false,
  userReduced: false,
  setUserReduced: () => {},
});

const STORAGE_KEY = "apphouse:movimiento";
const listeners = new Set<() => void>();
let memoryValue: boolean | null = null;

function readPreference(): boolean {
  if (memoryValue !== null) return memoryValue;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "reducido";
  } catch {
    return false;
  }
}

function writePreference(value: boolean) {
  memoryValue = value;
  try {
    if (value) window.localStorage.setItem(STORAGE_KEY, "reducido");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin almacenamiento disponible: la preferencia dura lo que dure la sesión.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion() ?? false;
  const userReduced = useSyncExternalStore(subscribe, readPreference, () => false);
  const reduced = systemReduced || userReduced;

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  }, [reduced]);

  const setUserReduced = useCallback((value: boolean) => writePreference(value), []);

  const value = useMemo(
    () => ({ reduced, userReduced, setUserReduced }),
    [reduced, userReduced, setUserReduced],
  );

  return (
    <MotionPrefContext.Provider value={value}>
      <MotionConfig reducedMotion={userReduced ? "always" : "user"}>{children}</MotionConfig>
    </MotionPrefContext.Provider>
  );
}

export const useMotionPref = () => useContext(MotionPrefContext);
