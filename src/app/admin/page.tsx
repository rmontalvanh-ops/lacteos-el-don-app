"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

import { formatoMoneda } from "@/utils/moneda";
import { exportarPedidosExcel } from "@/utils/exportExcel";
import { formatearFecha } from "@/utils/fecha";

export default function AdminPedidos() {

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtrados, setFiltrados] = useState<any[]>([]);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [pedidos, fechaInicio, fechaFin, estadoFiltro]);

  // =====================
  // CARGAR PEDIDOS
  // =====================

  const cargarPedidos = async () => {

    const snap = await getDocs(collection(db, "pedidos"));

    const lista:any = [];

    snap.forEach(doc => {
      lista.push({
        id: doc.id,
        ...doc.data()
      });
    });

    setPedidos(lista);
  };

  // =====================
  // FILTROS
  // =====================

  const aplicarFiltros = () => {

    let data = [...pedidos];

    // estado
    if (estadoFiltro) {
      data = data.filter(p => p.estado === estadoFiltro);
    }

    // fecha inicio
    if (fechaInicio) {
      data = data.filter(p =>
        p.fecha?.seconds
          ? new Date(p.fecha.seconds * 1000) >= new Date(fechaInicio)
          : true
      );
    }

    // fecha fin
    if (fechaFin) {
      data = data.filter(p =>
        p.fecha?.seconds
          ? new Date(p.fecha.seconds * 1000) <= new Date(fechaFin + "T23:59:59")
          : true
      );
    }

    setFiltrados(data);
  };

  // =====================
  // CAMBIAR ESTADO
  // =====================

  const cambiarEstado = async (id:string, estado:string) => {

    await updateDoc(doc(db, "pedidos", id), {
      estado
    });

    cargarPedidos();
  };

  // =====================
  // UI
  // =====================

  return (

    <main className="p-4 md:p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-4">
        📦 Panel de Pedidos
      </h1>

      {/* FILTROS */}

      <div className="bg-white p-4 rounded-xl shadow mb-6 grid gap-3 md:grid-cols-4">

        <input
          type="date"
          value={fechaInicio}
          onChange={(e)=>setFechaInicio(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e)=>setFechaFin(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={estadoFiltro}
          onChange={(e)=>setEstadoFiltro(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="preparacion">Preparación</option>
          <option value="entregado">Entregado</option>
        </select>

        <button
          onClick={() => exportarPedidosExcel(filtrados)}
          className="bg-green-600 text-white p-2 rounded"
        >
          📊 Exportar
        </button>

      </div>

      {/* LISTA */}

      <div className="grid gap-4">

        {filtrados.map(p => (

          <div key={p.id} className="bg-white p-4 rounded-xl shadow">

            <p className="font-bold">{p.cliente}</p>
            <p className="text-sm text-gray-500">{p.telefono}</p>

            {/* ✅ FECHA ARREGLADA */}
            <p className="text-xs text-gray-400">
              {formatearFecha(p.fecha)}
            </p>

            <div className="my-2 text-sm">

              {p.productos?.map((prod:any, i:number) => (
                <p key={i}>
                  • {prod.nombre} x{prod.cantidad}
                </p>
              ))}

            </div>

            <p className="font-bold">
              {formatoMoneda(p.total)}
            </p>

            <div className="flex gap-2 mt-2">

              <button
                onClick={()=>cambiarEstado(p.id,"pendiente")}
                className="bg-yellow-400 px-2 py-1 rounded text-sm"
              >
                Pendiente
              </button>

              <button
                onClick={()=>cambiarEstado(p.id,"preparacion")}
                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              >
                Preparación
              </button>

              <button
                onClick={()=>cambiarEstado(p.id,"entregado")}
                className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              >
                Entregado
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}