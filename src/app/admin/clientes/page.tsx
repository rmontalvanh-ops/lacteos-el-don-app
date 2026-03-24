"use client";

/*
Dashboard de clientes:
- Agrupa pedidos por cliente
- Calcula total comprado
- Cuenta pedidos
*/

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function ClientesAdmin() {

  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {

    const snap = await getDocs(collection(db, "pedidos"));

    const data:any = {};

    snap.forEach(doc => {

      const pedido = doc.data();

      if (!data[pedido.telefono]) {
        data[pedido.telefono] = {
          cliente: pedido.cliente,
          telefono: pedido.telefono,
          total: 0,
          pedidos: 0
        };
      }

      data[pedido.telefono].total += pedido.total;
      data[pedido.telefono].pedidos += 1;

    });

    // convertir a array
    const lista = Object.values(data);

    // ordenar por más compras
    lista.sort((a:any, b:any) => b.total - a.total);

    setClientes(lista);

  };

  return (

    <main className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        📊 Clientes
      </h1>

      <div className="grid gap-4">

        {clientes.map((c, i) => (

          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >

            <div>
              <p className="font-bold">{c.cliente}</p>
              <p className="text-sm text-gray-500">{c.telefono}</p>
            </div>

            <div className="text-right">
              <p className="font-bold">L {c.total.toFixed(2)}</p>
              <p className="text-sm">{c.pedidos} pedidos</p>
            </div>

          </div>

        ))}

      </div>

    </main>
  );
}