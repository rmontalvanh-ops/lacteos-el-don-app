import * as XLSX from "xlsx";

export const exportarPedidosExcel = (pedidos: any[]) => {

  const data = pedidos.map(p => ({

    Cliente: p.cliente,
    Telefono: p.telefono,
    Direccion: p.direccion,
    Total: p.total,
    Estado: p.estado,
    Fecha: new Date().toLocaleString("es-HN"),

    Productos: p.productos
      ?.map((prod:any) =>
        `${prod.nombre} x${prod.cantidad}`
      )
      .join(", ")

  }));

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pedidos");

  XLSX.writeFile(wb, "reporte_pedidos.xlsx");
};