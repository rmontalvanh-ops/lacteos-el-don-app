/*
Función para formatear moneda hondureña
Ejemplo: 95.5 -> L 95.50
*/

export const formatoMoneda = (valor:number) => {

  return new Intl.NumberFormat(
    "es-HN",
    {
      style: "currency",
      currency: "HNL"
    }
  ).format(valor);

};