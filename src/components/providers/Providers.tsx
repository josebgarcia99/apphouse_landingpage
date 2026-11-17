"use client";

import type { ReactNode } from "react";
import { DemoProvider } from "./DemoProvider";
import { MotionProvider } from "./MotionProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <DemoProvider>{children}</DemoProvider>
    </MotionProvider>
  );
}
