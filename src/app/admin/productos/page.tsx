"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function ProductosAdmin() {

  const [productos, setProductos] = useState<any[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {

    const snap = await getDocs(collection(db, "productos"));

    const lista:any = [];

    snap.forEach(doc => {
      lista.push({ id: doc.id, ...doc.data() });
    });

    setProductos(lista);
  };

  const crearProducto = async () => {

    await addDoc(collection(db, "productos"), {
      nombre,
      precio: parseFloat(precio)
    });

    setNombre("");
    setPrecio("");

    cargarProductos();
  };

  const eliminarProducto = async (id:string) => {

    await deleteDoc(doc(db, "productos", id));
    cargarProductos();
  };

  return (

    <main className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        🛠 Productos
      </h1>

      {/* CREAR */}

      <div className="bg-white p-4 rounded-xl shadow mb-4">

        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e)=>setNombre(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Precio"
          value={precio}
          onChange={(e)=>setPrecio(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={crearProducto}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Crear
        </button>

      </div>

      {/* LISTA */}

      <div className="grid gap-3">

        {productos.map(p => (

          <div
            key={p.id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <span>{p.nombre} - L {p.precio}</span>

            <button
              onClick={()=>eliminarProducto(p.id)}
              className="text-red-500"
            >
              Eliminar
            </button>
          </div>

        ))}

      </div>

    </main>
  );
}