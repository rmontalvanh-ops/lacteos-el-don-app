/*
Control de carrito abandonado
*/

import { enviarWhatsApp } from "./whatsapp";
import { obtenerMensajes } from "./chatbot";
import { procesarMensaje } from "./template";

// 🔥 variable global del timer
let timerActivo: any = null;


/*
Inicia el timer de abandono
*/
export const iniciarTimerCarrito = (telefono: string, carrito: any[]) => {

  // 🧠 evita múltiples timers
  if (timerActivo) {
    clearTimeout(timerActivo);
  }

  timerActivo = setTimeout(async () => {

    if (!carrito || carrito.length === 0) return;

    const mensajes = await obtenerMensajes();

    if (!mensajes?.abandono) return;

    let productos = "";

    carrito.forEach(p => {
      productos += `• ${p.nombre} x${p.cantidad}\n`;
    });

    const mensaje = procesarMensaje(
  mensajes.abandono,
  {
    telefono,
    productos: carrito,
    fecha: new Date().toLocaleString("es-HN")
  }
);

    enviarWhatsApp(telefono, mensaje);

  }, 1000 * 60 * 10); // ⏱ 10 minutos

};


/*
🔥 NUEVO: cancelar timer (IMPORTANTE)
*/
export const cancelarTimer = () => {

  if (timerActivo) {
    clearTimeout(timerActivo);
    timerActivo = null;
  }

};