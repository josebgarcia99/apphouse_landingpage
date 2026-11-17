import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

// Tipografías autoalojadas (SIL Open Font License). No hay peticiones a servicios externos.
const bricolage = localFont({
  src: "../fonts/BricolageGrotesque-Variable.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const figtree = localFont({
  src: "../fonts/Figtree-Variable.woff2",
  variable: "--font-figtree",
  weight: "300 900",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Apphouse — Tu negocio en movimiento · Prototipo",
  description:
    "Prototipo de demostración: una aplicación con tu marca, tus productos y un canal directo para recibir pedidos de tus clientes.",
  // Prototipo independiente: no debe indexarse.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0e0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" className={`${bricolage.variable} ${figtree.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        <Providers>{children}</Providers>
        {/* Sin JavaScript, el contenido que se revela al desplazarse permanece visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </body>
    </html>
  );
}
