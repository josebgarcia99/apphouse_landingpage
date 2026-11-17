/**
 * PREGUNTAS FRECUENTES
 * ------------------------------------------------------------------
 * Respuestas redactadas únicamente con características visibles en la página
 * pública de Apphouse (consultada el 15 de noviembre de 2026). No se agregan
 * condiciones contractuales. Revisar con el equipo comercial antes de publicar.
 */

export type FaqItem = { id: string; question: string; answer: string[] };

export const faq: FaqItem[] = [
  {
    id: "incluye",
    question: "¿Qué incluye Apphouse?",
    answer: [
      "Apphouse es un servicio tecnológico por licenciamiento mensual que le da a tu negocio su propia app de pedidos, con tu logotipo, tus colores y tus productos.",
      "Incluye cuatro herramientas conectadas: la aplicación para tus clientes, el panel administrativo web, la aplicación de gestión para tu establecimiento y la aplicación para repartidores. También incluye reportes y estadísticas según el rol de cada usuario, y soporte tecnológico.",
    ],
  },
  {
    id: "descarga",
    question: "¿Mis clientes deben descargar una aplicación?",
    answer: [
      "Sí. Tu app se publica en App Store y Google Play con el nombre y la imagen de tu negocio. Tus clientes la descargan, eligen sus productos y hacen su pedido desde ahí.",
      "Para que la encuentren, puedes compartir el enlace de descarga en tus redes sociales, por WhatsApp o en tu local.",
    ],
  },
  {
    id: "identidad",
    question: "¿Mi app tendrá el nombre y los colores de mi establecimiento?",
    answer: [
      "Sí. La aplicación para tus clientes lleva tu nombre comercial, tu logotipo y tus colores. Durante la activación configuras tu identidad visual, tu catálogo y los elementos disponibles.",
    ],
  },
  {
    id: "entregas",
    question: "¿Quién realiza las entregas?",
    answer: [
      "Tu establecimiento organiza sus propias entregas. Apphouse proporciona la tecnología —incluida la aplicación para tus repartidores, con seguimiento de pedidos y comunicación con el cliente—, pero no suministra repartidores ni realiza el reparto físico.",
    ],
  },
  {
    id: "comisiones",
    question: "¿Apphouse cobra comisiones por venta?",
    answer: [
      "Conviene distinguir tres conceptos. Comisión de intermediación: los pedidos hechos directamente en la app de tu establecimiento no pasan por plataformas de reparto de terceros ni generan sus comisiones.",
      "Mensualidad: pagas el licenciamiento mensual de tu plan, que incluye una cantidad de pedidos al mes.",
      "Pedidos adicionales: si superas los pedidos incluidos, se suma una tarifa fija por cada pedido adicional, según tu plan. Es decir, el servicio sí tiene costos; lo que no hay es comisión de intermediación de plataformas externas.",
    ],
  },
  {
    id: "excedente",
    question: "¿Qué sucede cuando supero los pedidos incluidos?",
    answer: [
      "Se suma una tarifa fija por cada pedido adicional: $7.50 en el plan Micro, $2.50 en PYME y $2.00 en Multisucursal, con IVA incluido.",
      "En el plan Micro, la página pública indica que si superas los 200 pedidos desde el primer mes, se te avisará para cambiarte a PYME, siempre que lo autorice el representante legal o quien contrató el servicio.",
    ],
  },
  {
    id: "tiempo",
    question: "¿Cuánto tiempo tarda en estar lista mi aplicación?",
    answer: [
      "Después de validar tu contratación comienza la configuración de tu app con tu marca. Puede estar lista en hasta 30 días, ya que la publicación depende del proceso de revisión de App Store y Google Play.",
    ],
  },
  {
    id: "sucursales",
    question: "¿Puedo tener varias sucursales?",
    answer: [
      "Sí. El plan Multisucursal está pensado para negocios con dos o más sucursales e incluye reportes por sucursal. Los planes Micro y PYME contemplan una sucursal.",
    ],
  },
  {
    id: "soporte",
    question: "¿Incluye soporte tecnológico?",
    answer: [
      "Sí. Al recibir tus accesos se te comparte un tutorial y un manual de uso del panel administrativo. Además cuentas con soporte tecnológico para resolver dudas relacionadas con el funcionamiento de Apphouse.",
    ],
  },
  {
    id: "demo",
    question: "¿Cómo puedo solicitar una demostración?",
    answer: [
      "En esta página puedes abrir una demostración local con datos ficticios, sin dejar ningún dato personal: usa el botón «Probar demostración».",
      "Para solicitar el acceso a la demo oficial de la app y del panel administrativo, visita la página oficial de Apphouse, donde se indica cómo recibirlo por correo.",
    ],
  },
];
