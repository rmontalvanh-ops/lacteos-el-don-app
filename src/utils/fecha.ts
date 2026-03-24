export const formatearFecha = (fecha: any) => {

  if (!fecha) return "Sin fecha";

  if (fecha.seconds) {
    return new Date(fecha.seconds * 1000).toLocaleString("es-HN");
  }

  return new Date(fecha).toLocaleString("es-HN");
};