"use client";

/*
Panel de Chatbot - Lácteos El Don
Permite:
- Editar mensajes automáticos
- Guardar en Firebase
- Probar envío por WhatsApp
*/

import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebaseConfig";

import {
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

export default function ChatbotAdmin() {

  // estados de mensajes
  const [mensajes, setMensajes] = useState({
    bienvenida: "",
    abandono: "",
    seguimiento: "",
    promocion: ""
  });

  const [guardando, setGuardando] = useState(false);


  /*
  Cargar configuración desde Firebase
  */
  const cargarMensajes = async () => {

    try {

      const ref = doc(db, "config", "chatbot");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setMensajes(snap.data() as any);
      }

    } catch (error) {
      console.error("Error cargando chatbot", error);
    }

  };


  /*
  Guardar en Firebase
  */
  const guardarMensajes = async () => {

    try {

      setGuardando(true);

      const ref = doc(db, "config", "chatbot");

      await setDoc(ref, mensajes);

      alert("✅ Mensajes guardados correctamente");

    } catch (error) {

      console.error("Error guardando", error);

    } finally {
      setGuardando(false);
    }

  };


  /*
  Probar mensaje en WhatsApp
  */
  const probarMensaje = (texto:string) => {

    const telefono = prompt("Ingrese número (sin +504):");

    if (!telefono) return;

    const url = `https://wa.me/504${telefono}?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");

  };


  /*
  Cargar al iniciar
  */
  useEffect(() => {
    cargarMensajes();
  }, []);


  /*
  Render
  */
  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-3xl font-bold mb-6">
        🤖 Panel de Chatbot
      </h1>

      <p className="text-gray-600 mb-8">
        Configura mensajes automáticos para ventas y fidelización
      </p>


      <div className="grid gap-6 max-w-3xl">


        {/* BIENVENIDA */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-bold text-lg mb-2">
            👋 Mensaje de bienvenida
          </h2>

          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            value={mensajes.bienvenida}
            onChange={(e)=>setMensajes({...mensajes, bienvenida: e.target.value})}
          />

          <button
            onClick={()=>probarMensaje(mensajes.bienvenida)}
            className="mt-2 text-sm text-blue-600"
          >
            Probar en WhatsApp
          </button>

        </div>


        {/* ABANDONO */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-bold text-lg mb-2">
            🛒 Carrito abandonado
          </h2>

          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            value={mensajes.abandono}
            onChange={(e)=>setMensajes({...mensajes, abandono: e.target.value})}
          />

          <button
            onClick={()=>probarMensaje(mensajes.abandono)}
            className="mt-2 text-sm text-blue-600"
          >
            Probar en WhatsApp
          </button>

        </div>


        {/* SEGUIMIENTO */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-bold text-lg mb-2">
            📦 Seguimiento post-venta
          </h2>

          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            value={mensajes.seguimiento}
            onChange={(e)=>setMensajes({...mensajes, seguimiento: e.target.value})}
          />

          <button
            onClick={()=>probarMensaje(mensajes.seguimiento)}
            className="mt-2 text-sm text-blue-600"
          >
            Probar en WhatsApp
          </button>

        </div>


        {/* PROMOCION */}
        <div className="bg-white p-5 rounded-xl shadow">

          <h2 className="font-bold text-lg mb-2">
            🔥 Promociones
          </h2>

          <textarea
            className="w-full border p-3 rounded"
            rows={4}
            value={mensajes.promocion}
            onChange={(e)=>setMensajes({...mensajes, promocion: e.target.value})}
          />

          <button
            onClick={()=>probarMensaje(mensajes.promocion)}
            className="mt-2 text-sm text-blue-600"
          >
            Probar en WhatsApp
          </button>

        </div>


        {/* BOTÓN GUARDAR */}
        <button
          onClick={guardarMensajes}
          disabled={guardando}
          className="bg-green-600 text-white py-3 rounded-xl font-bold"
        >
          {guardando ? "Guardando..." : "💾 Guardar configuración"}
        </button>

      </div>

    </main>

  );

}