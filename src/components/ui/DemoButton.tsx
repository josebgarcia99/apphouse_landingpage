"use client";

import type { ComponentProps } from "react";
import { useDemo } from "@/components/providers/DemoProvider";
import { Button } from "./Button";

type DemoButtonProps = Pick<ComponentProps<typeof Button>, "variant" | "size" | "icon" | "className"> & {
  children: string;
};

/** Botón que abre la demostración local desde cualquier sección. */
export function DemoButton({ children, variant = "accent", size, icon = "play", className }: DemoButtonProps) {
  const { openDemo } = useDemo();
  return (
    <Button variant={variant} size={size} icon={icon} className={className} onClick={openDemo}>
      {children}
    </Button>
  );
}
