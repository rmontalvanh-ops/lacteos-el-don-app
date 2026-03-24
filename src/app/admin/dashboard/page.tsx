"use client";

/*
Dashboard con gráficas:
- Ventas por día
- Totales
*/

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { formatearFecha } from "@/utils/fecha";

export default function Dashboard() {

  const [pedidos, setPedidos] = useState<any[]>([]);
  const [ventasPorDia, setVentasPorDia] = useState<any[]>([]);
  const [topProductos, setTopProductos] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {

    const snap = await getDocs(collection(db, "pedidos"));

    const lista:any = [];

    snap.forEach(doc => {
      lista.push(doc.data());
    });

    setPedidos(lista);

    procesarVentas(lista);
    procesarProductos(lista);
  };

  // =====================
  // 📊 VENTAS POR DÍA
  // =====================

  const procesarVentas = (data:any[]) => {

    const mapa:any = {};

    data.forEach(p => {

      if (!p.fecha) return;

      const fecha = p.fecha.seconds
        ? new Date(p.fecha.seconds * 1000)
        : new Date(p.fecha);

      const dia = fecha.toLocaleDateString("es-HN");

      if (!mapa[dia]) {
        mapa[dia] = 0;
      }

      mapa[dia] += p.total;
    });

    const resultado = Object.keys(mapa).map(dia => ({
      dia,
      total: mapa[dia]
    }));

    setVentasPorDia(resultado);
  };

  // =====================
  // 🧀 TOP PRODUCTOS
  // =====================

  const procesarProductos = (data:any[]) => {

    const mapa:any = {};

    data.forEach(p => {

      p.productos?.forEach((prod:any) => {

        if (!mapa[prod.nombre]) {
          mapa[prod.nombre] = 0;
        }

        mapa[prod.nombre] += prod.cantidad;

      });

    });

    const resultado = Object.keys(mapa).map(nombre => ({
      nombre,
      cantidad: mapa[nombre]
    }));

    setTopProductos(resultado);
  };

  // =====================
  // 💰 TOTAL GENERAL
  // =====================

  const totalGeneral = pedidos.reduce(
    (acc, p) => acc + p.total,
    0
  );

  // =====================
  // UI
  // =====================

  return (

    <main className="p-4 md:p-8 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        📊 Dashboard
      </h1>

      {/* KPIs */}

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Ingresos</p>
          <p className="text-xl font-bold">L {totalGeneral.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Pedidos</p>
          <p className="text-xl font-bold">{pedidos.length}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Promedio</p>
          <p className="text-xl font-bold">
            L {(totalGeneral / (pedidos.length || 1)).toFixed(2)}
          </p>
        </div>

      </div>

      {/* 📈 GRÁFICA DE VENTAS */}

      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <h2 className="font-bold mb-3">
          Ventas por día
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ventasPorDia}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* 🧀 TOP PRODUCTOS */}

      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-bold mb-3">
          Productos más vendidos
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProductos}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </main>
  );
}