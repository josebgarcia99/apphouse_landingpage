# Apphouse — Tu negocio en movimiento

Prototipo visual y funcional de una nueva página para Apphouse: una portada cinematográfica, un recorrido interactivo del producto y una demostración local navegable.

> **Es un prototipo independiente.** No es la página oficial, no procesa pagos, no pide ni guarda datos personales y no se conecta a ningún sistema de producción. Las marcas de ejemplo, los pedidos, las cifras del tablero y las fotografías son ilustrativos.

## Cómo abrirlo

Requiere Node.js 20.9 o posterior.

```bash
npm install
npm run dev
```

Abre la dirección que imprime la terminal. Normalmente es <http://localhost:3000>; si ese puerto está ocupado, Next.js usa el siguiente libre (por ejemplo <http://localhost:3001>) y lo indica en la línea `Local:`.

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente. |
| `npm run build` | Compilación de producción (incluye la verificación de TypeScript). |
| `npm run start` | Sirve la compilación de producción. |
| `npm run lint` | ESLint. |

## Qué incluye

Una sola página (`src/app/page.tsx`) con estas secciones, en orden:

1. **Portada**: secuencia de cinco escenas (27 s) con fundidos, pausa, selección manual y titular animado.
2. **Establecimientos**: selector de cuatro sectores que cambia fotografía, colores, identidad del teléfono y catálogo.
3. **Cómo funciona**: recorrido de un pedido en cuatro pasos, con el dispositivo fijo en escritorio y vertical en móvil.
4. **Las cuatro herramientas**: un mismo pedido visto desde la app del cliente, el panel, la app de gestión y la app de repartidores.
5. **Beneficios**: los cuatro pilares, cada uno con un recurso visual.
6. **Datos y estadísticas**: tablero ficticio con filtros de periodo y sucursal, y vista de tabla.
7. **Demostración**: abre una experiencia a pantalla completa (catálogo → carrito → pedido → panel → seguimiento) que se puede reiniciar.
8. **Planes y precios**: tres planes, calculadora de pedidos adicionales y resumen simulado de selección.
9. **Activación**, **Preguntas frecuentes**, **Cierre** y **pie de página**.

Tecnología: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion para React y Lucide. No hay otras dependencias de ejecución.

## Estructura

```
src/
  app/            layout, página, estilos globales (tokens de diseño) e icono
  config/media.ts ← único archivo para sustituir videos e imágenes
  data/           datos ficticios: sectores, pedidos, planes, preguntas, tablero, navegación
  lib/            motor de pedidos simulados, comprobación de archivos en servidor, utilidades
  components/
    hero/         portada y reproductor de escenas
    sections/     una sección por archivo
    appui/        interfaces de ejemplo (catálogo, carrito, seguimiento, gestión, repartidor, panel)
    devices/      marcos de teléfono y de ventana de escritorio
    dashboard/    gráficas del tablero (sin librerías)
    demo/         demostración local a pantalla completa
    layout/       barra de navegación y pie
    providers/    preferencia de movimiento y apertura de la demo
    ui/           botón, logotipo, encabezados, imagen con respaldo, etiquetas
  fonts/          tipografías autoalojadas
public/media/
  hero/           videos de la portada (vacía por ahora)
  posters/        imágenes de respaldo de cada escena y fondos de sección
  sectors/        fotografía editorial de cada sector
  product/        fotografías de producto de los catálogos
  credits.json    autoría y licencia de cada fotografía
```

Next.js 16 cambió varias convenciones respecto a versiones anteriores; `AGENTS.md` (generado por Next) apunta a la documentación incluida en `node_modules/next/dist/docs/`.

## Sustituir los videos de la portada

No hay que tocar ningún componente.

1. Copia cada archivo en `public/media/hero/` con estos nombres:

   | Escena | Archivo | Encuadre vertical opcional |
   | --- | --- | --- |
   | Restaurante | `restaurante.mp4` | `restaurante-movil.mp4` |
   | Cosméticos | `cosmeticos.mp4` | `cosmeticos-movil.mp4` |
   | Ferretería | `ferreteria.mp4` | `ferreteria-movil.mp4` |
   | Autopartes | `autopartes.mp4` | `autopartes-movil.mp4` |
   | Experiencia digital | `apphouse-experiencia.mp4` | `apphouse-experiencia-movil.mp4` |

2. Reinicia `npm run dev` (o vuelve a ejecutar `npm run build`).

Cómo se comporta:

- El servidor comprueba qué archivos existen (`src/lib/media.server.ts`). Una escena sin video usa su póster con un movimiento de cámara suave, así que nunca hay referencias rotas ni pantalla en negro.
- Si un video existe pero no se puede reproducir, la escena vuelve a su póster.
- Con «reducir movimiento» activo (del sistema o del interruptor del pie de página) no se reproducen videos ni avanza la secuencia; quedan la imagen fija y la selección manual.
- La duración de cada escena, el punto de interés del encuadre para escritorio y móvil, el texto alternativo y el guion de cada toma están en `src/config/media.ts`.

Formato recomendado: MP4 (H.264), sin pista de audio, 1920×1080 a 24–30 fps, 5 a 6 segundos por escena y de 2 a 3 MB cada uno. Para móvil, 1080×1920. El póster de cada escena debe ser un fotograma representativo del video, con el mismo nombre en `public/media/posters/`.

El campo `grade` de algunas escenas es un filtro CSS que iguala el color de las fotografías provisionales; quítalo cuando el material propio ya venga etalonado.

## Datos ficticios

Todo vive en `src/data/` y en el estado local del navegador; nada se envía a un servidor.

- `sectors.ts`: marcas inventadas (Brasa Norte, Lúmina, La Escuadra, Vértice), con sus colores, productos y precios.
- `orders.ts`: pedido de ejemplo, pedidos anteriores y estados posibles.
- `analytics.ts`: las cifras del tablero se generan con una fórmula determinista a partir de perfiles inventados por sucursal.
- `plans.ts`: planes y fórmula de la calculadora.
- `faq.ts`: preguntas y respuestas.

Lo único que se guarda en el navegador es la preferencia «Reducir movimiento» (`localStorage`).

## Información comercial usada

Tomada de la página pública <https://apphouse.tupide.mx/> el 15 de noviembre de 2026:

| Plan | Mensualidad (IVA incluido) | Sucursales | Pedidos incluidos | Pedido adicional |
| --- | --- | --- | --- | --- |
| Micro | $4,000 MXN | Una | 100 | $7.50 MXN |
| PYME | $7,650 MXN | Una | 350 | $2.50 MXN |
| Multisucursal | $13,500 MXN | Dos o más | 1,100 | $2.00 MXN |

La calculadora aplica: mensualidad base + (pedidos que exceden los incluidos × tarifa por pedido adicional). No incluye descuentos ni otros conceptos.

También provienen de esa página: las cuatro herramientas, los cuatro pilares, los reportes por rol, las cuatro etapas de activación, el plazo de hasta 30 días sujeto a la revisión de las tiendas de aplicaciones, que Apphouse no suministra repartidores, y el aviso del plan Micro al superar 200 pedidos.

## Identidad visual

- **Color.** Base carbón (`#0a0e0e` a `#151b1a`) y blanco cálido (`#f7f5f0`). El aqua y el azul salen del logotipo publicado (`#43d7bd`, `#36a0ad`, `#4d6aeb`, `#153c7a`) y se usan para la tecnología y las acciones; la terracota (`#ee8260`) aporta el lado humano. Los tokens están en `src/app/globals.css`.
- **Tipografía.** Bricolage Grotesque para titulares y Figtree para texto, ambas autoalojadas. La página oficial usa Poppins; habrá que decidir si se conserva.
- **Logotipo.** `src/components/ui/ApphouseLogo.tsx` es un redibujo del SVG publicado en la página oficial, con una variante para fondos oscuros.

## Accesibilidad y movimiento

- Estructura semántica, enlace «Saltar al contenido», foco visible y navegación por teclado en pestañas, acordeón, menú y diálogos (`<dialog>` nativo).
- El movimiento usa transformaciones y opacidad. Se respeta `prefers-reduced-motion` y hay un interruptor «Reducir movimiento» en el pie de página.
- La portada tiene botón de pausa y se detiene sola cuando sale de pantalla o la pestaña queda oculta.
- Las gráficas tienen detalle al pasar el cursor o enfocar, y una vista de tabla equivalente.

## Comprobaciones realizadas

Ejecutadas el 15 de noviembre de 2026 en macOS con Brave (Chromium) sin interfaz gráfica:

- `npm run lint` y `npm run build`: sin errores.
- 23 comprobaciones funcionales automatizadas, superadas tanto en desarrollo como sobre la compilación de producción: avance automático, pausa y selección de escenas; navegación; selector de sectores; carrito, pedido, cambios de estado y seguimiento; sincronía entre las cuatro herramientas; filtros y tablas del tablero; calculadora y resumen de plan; acordeón; demostración completa con reinicio; menú, pestañas y demo en móvil; interruptor de movimiento; ausencia de desplazamiento horizontal de 360 a 1920 px; consola sin errores.
- Auditoría automática con axe-core (WCAG 2.1 A y AA, y buenas prácticas) de la página y de la demo abierta, a 1440 y 390 px: sin incidencias.
- Sistema de video: con un clip MP4 sintético de prueba se verificó que el video se reproduce en la escena activa, que la pausa lo detiene, que un archivo corrupto cae al póster y que sin archivos no se genera ningún `<video>`. Los archivos de prueba se eliminaron.
- Revisión visual con capturas en escritorio (1440 px), tablet (1024 px) y móvil (390 px).

No se hizo:

- Pruebas en Safari, Firefox ni en teléfonos físicos.
- Pruebas con lector de pantalla.
- Medición de rendimiento (Lighthouse o Core Web Vitals).
- Prueba con los videos definitivos, que aún no existen.

## Recursos faltantes para una versión definitiva

1. **Cinco videos de la portada**, con una misma dirección de fotografía, más sus encuadres verticales y pósters.
2. **Fotografía propia** de establecimientos y productos, con autorización de las personas y los locales que aparezcan.
3. **Capturas o grabaciones reales** de las cuatro herramientas de Apphouse; las interfaces actuales son recreaciones conceptuales.
4. **Archivo maestro del logotipo** y lineamientos de marca (paleta y tipografía oficiales).
5. **Textos comerciales aprobados**, incluida la decisión sobre la grafía de la marca.
6. **Enlaces oficiales** de términos, aviso de privacidad y soporte.
7. **Integración** con el formulario de demo y el proceso de contratación reales.
8. **Imagen para compartir** en redes (Open Graph) y metadatos definitivos.

## Verificaciones antes de publicar

- [ ] Confirmar precios, pedidos incluidos, tarifas por pedido adicional e IVA con el equipo comercial.
- [ ] Revisar con el área legal el texto sobre comisiones de intermediación, el plazo de 30 días y las respuestas de preguntas frecuentes.
- [ ] Unificar la grafía de la marca: el logotipo y este prototipo usan «Apphouse»; los textos de la página oficial usan «AppHouse».
- [ ] Sustituir todas las fotografías provisionales. Tres muestran rostros reconocibles (`posters/restaurante.jpg`, `posters/cierre.jpg`) o marcas legibles de terceros (`sectors/ferreteria.jpg`), y la Licencia Unsplash no incluye autorización de las personas retratadas.
- [ ] Decidir si los cuatro sectores se mantienen como ejemplos. Hoy se presentan como conceptuales y no afirman compatibilidad con requisitos de ningún giro.
- [ ] Quitar las etiquetas y avisos de prototipo solo donde el contenido ya sea real, y conservar «Datos ilustrativos» donde siga siendo ficticio.
- [ ] Retirar `robots: { index: false }` de `src/app/layout.tsx` y completar título, descripción e imagen para compartir.
- [ ] Conectar los botones de plan y de demo con los flujos reales, o retirarlos.
- [ ] Probar en Safari (macOS e iOS), Firefox, Chrome en Android y con lector de pantalla.
- [ ] Medir rendimiento con los videos definitivos. El HTML inicial pesa unos 400 KB sin comprimir porque las interfaces de ejemplo se generan para escritorio y para móvil; conviene cargarlas según el tamaño de pantalla.
- [ ] Añadir analítica y aviso de cookies si corresponde.

## Créditos y licencias

- **Fotografías:** Unsplash, bajo la Licencia Unsplash. El archivo `public/media/credits.json` indica, para cada imagen, qué muestra, quién la tomó y su página de origen.
- **Tipografías:** Bricolage Grotesque y Figtree, SIL Open Font License 1.1 (textos de licencia en `src/fonts/`).
- **Iconos:** Lucide (licencia ISC).

Fotografías alternativas que se evaluaron y no se incluyeron:

- Entrega de pedido con bolsas de papel: <https://unsplash.com/photos/Dz0PZsrGcNw>
- Cierre sin rostros reconocibles (cocina abierta de noche): <https://unsplash.com/photos/EhiaaAZmipE>
- Pasillo de tienda con una persona de espaldas: <https://unsplash.com/photos/sf6YUxvCoro>
- Manos con teléfono en una cafetería: <https://unsplash.com/photos/mCP4W-1b34w>
- Estantería de boutique de belleza: <https://unsplash.com/photos/RJ0v-mj0Yxs>
