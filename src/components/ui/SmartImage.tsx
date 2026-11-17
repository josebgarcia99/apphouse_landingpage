"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type SmartImageProps = {
  /** Ruta dentro de /public. Si es null o falla la carga se muestra el respaldo. */
  src: string | null;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  preload?: boolean;
  eager?: boolean;
  quality?: 60 | 75 | 85;
  /** Clases del respaldo cuando no hay imagen (por defecto, un degradado carbón). */
  fallbackClassName?: string;
};

/**
 * Imagen optimizada que nunca deja un hueco: si el archivo falta o falla,
 * se pinta una composición de respaldo en su lugar.
 */
export function SmartImage({
  src,
  alt,
  sizes,
  className,
  style,
  preload = false,
  eager = false,
  quality = 75,
  fallbackClassName,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(
          "absolute inset-0",
          fallbackClassName ??
            "bg-[radial-gradient(120%_90%_at_72%_18%,#33443f_0%,#1a2321_48%,#0a0e0e_100%)]",
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={preload}
      loading={preload ? undefined : eager ? "eager" : "lazy"}
      className={cn("object-cover", className)}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
