"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Abre la demostración local desde cualquier botón de la página.
 * El código de la demo se descarga solo la primera vez que se abre.
 */
const DemoExperience = dynamic(() => import("@/components/demo/DemoExperience"), {
  ssr: false,
});

type DemoContextValue = { openDemo: () => void };

const DemoContext = createContext<DemoContextValue>({ openDemo: () => {} });

export function DemoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const openDemo = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openDemo }), [openDemo]);

  return (
    <DemoContext.Provider value={value}>
      {children}
      {mounted ? <DemoExperience open={open} onClose={() => setOpen(false)} /> : null}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
