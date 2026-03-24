/*
Motor de variables dinámicas
Reemplaza textos como:
{{cliente}}, {{total}}, {{productos}}, {{fecha}}
*/

export const procesarMensaje = (
  plantilla: string,
  datos: any
) => {

  if (!plantilla) return "";

  let mensaje = plantilla;

  // =========================
  // VARIABLES BÁSICAS
  // =========================

  mensaje = mensaje.replace(/{{cliente}}/g, datos.cliente || "");
  mensaje = mensaje.replace(/{{telefono}}/g, datos.telefono || "");
  mensaje = mensaje.replace(/{{total}}/g, datos.total || "");
  mensaje = mensaje.replace(/{{fecha}}/g, datos.fecha || "");

  // =========================
  // PRODUCTOS
  // =========================

  if (datos.productos && Array.isArray(datos.productos)) {

    const lista = datos.productos.map((p: any) =>
      `• ${p.nombre} x${p.cantidad} = L ${(p.precio * p.cantidad).toFixed(2)}`
    ).join("\n");

    mensaje = mensaje.replace(/{{productos}}/g, lista);

  }

  return mensaje;
};