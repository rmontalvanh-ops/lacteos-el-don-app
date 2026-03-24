/*
Función reutilizable para enviar mensajes por WhatsApp
*/

export const enviarWhatsApp = (telefono: string, mensaje: string) => {

  const url = `https://wa.me/504${telefono}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");

};