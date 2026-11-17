import fs from "node:fs";
import path from "node:path";
import { heroScenes, type HeroSceneConfig } from "@/config/media";

/**
 * Comprobación en servidor de los recursos de /public.
 * Evita referencias rotas: un video o imagen que no exista simplemente no se
 * envía al navegador y el componente usa su alternativa visual.
 */
export function publicFileExists(publicPath: string | null | undefined): boolean {
  if (!publicPath) return false;
  try {
    const absolute = path.join(process.cwd(), "public", publicPath);
    return fs.statSync(absolute).size > 0;
  } catch {
    return false;
  }
}

export type ResolvedHeroScene = Omit<HeroSceneConfig, "video" | "videoMobile" | "poster"> & {
  video: string | null;
  videoMobile: string | null;
  poster: string | null;
};

export function resolveHeroScenes(): ResolvedHeroScene[] {
  return heroScenes.map((scene) => ({
    ...scene,
    video: publicFileExists(scene.video) ? scene.video : null,
    videoMobile: publicFileExists(scene.videoMobile) ? scene.videoMobile : null,
    poster: publicFileExists(scene.poster) ? scene.poster : null,
  }));
}

/** Devuelve la ruta solo si el archivo existe; si no, null. */
export function resolveImage(publicPath: string): string | null {
  return publicFileExists(publicPath) ? publicPath : null;
}
