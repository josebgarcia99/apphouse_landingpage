"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos para escalonar elementos. */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
};

/**
 * Revela el contenido al entrar en pantalla (solo opacidad y transformación).
 * Con movimiento reducido, Motion omite el desplazamiento automáticamente.
 */
export function Reveal({ children, className, delay = 0, y = 26 }: RevealProps) {
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
