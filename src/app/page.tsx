"use client";

import { useEffect, useState } from "react";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";

// carrito
import { iniciarTimerCarrito, cancelarTimer } from "@/utils/carritoAbandonado";

// Firebase
import { guardarPedido } from "../services/pedidos";

// chatbot
import { enviarWhatsApp } from "@/utils/whatsapp";
import { obtenerMensajes } from "@/utils/chatbot";
import { procesarMensaje } from "@/utils/template";

export default function Home() {

  const [carrito, setCarrito] = useState<any[]>([]);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  // ===============================
  // LOCAL STORAGE
  // ===============================

  useEffect(() => {

    const carritoGuardado = localStorage.getItem("carrito");
    const telefonoGuardado = localStorage.getItem("telefono");

    if (carritoGuardado) setCarrito(JSON.parse(carritoGuardado));
    if (telefonoGuardado) setTelefono(telefonoGuardado);

  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (telefono) localStorage.setItem("telefono", telefono);
  }, [telefono]);

  // ===============================
  // ACTUALIZAR CARRITO + TIMER
  // ===============================

  const actualizarCantidad = (producto: any, cantidad: number) => {

    let nuevoCarrito = [...carrito];

    if (cantidad <= 0) {
      nuevoCarrito = carrito.filter(p => p.id !== producto.id);
    } else {

      const existe = carrito.find(p => p.id === producto.id);

      if (existe) {
        nuevoCarrito = carrito.map(p =>
          p.id === producto.id ? { ...p, cantidad } : p
        );
      } else {
        nuevoCarrito = [...carrito, { ...producto, cantidad }];
      }
    }

    setCarrito(nuevoCarrito);

    // 🔥 TIMER
    const tel = telefono || localStorage.getItem("telefono");

    if (tel && nuevoCarrito.length > 0) {
      iniciarTimerCarrito(tel, nuevoCarrito);
    }
  };

  // ===============================
  // TOTAL
  // ===============================

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // ===============================
  // FINALIZAR PEDIDO (CON VARIABLES)
  // ===============================

  const finalizarPedido = async () => {

    try {

      const pedido = {
        cliente: nombre,
        telefono,
        direccion,
        productos: carrito,
        total,
        estado: "pendiente"
      };

      await guardarPedido(pedido);

      cancelarTimer();

      const mensajes = await obtenerMensajes();

      // 🔥 DATOS DINÁMICOS
      const datos = {
        cliente: nombre,
        telefono,
        total: total.toFixed(2),
        productos: carrito,
        fecha: new Date().toLocaleString("es-HN")
      };

      // 🧠 MENSAJE AUTOMÁTICO
      if (mensajes?.bienvenida) {

        const mensajeAuto = procesarMensaje(
          mensajes.bienvenida,
          datos
        );

        enviarWhatsApp(telefono, mensajeAuto);
      }

      // 🧾 MENSAJE COMPLETO
      const listaProductos = carrito.map(
        (p) =>
          `X${p.cantidad} ${p.nombre}  L ${(p.precio * p.cantidad).toFixed(2)}`
      ).join("\n");

      const mensaje = `
🗓️ ${datos.fecha}

Nombre: ${nombre}
Tel: ${telefono}
Dirección: ${direccion}

🛒 Productos:
${listaProductos}

Total: L ${total.toFixed(2)}
`;

      window.open(`https://wa.me/50496416141?text=${encodeURIComponent(mensaje)}`);

      setCarrito([]);
      localStorage.removeItem("carrito");

    } catch (error) {
      alert("Error guardando pedido");
    }

  };

  // ===============================
  // UI
  // ===============================

  return (

    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <h1 className="text-2xl md:text-4xl font-bold mb-2">
        🧀 Lácteos El Don
      </h1>

      <p className="text-gray-600 mb-6">
        Productos frescos directo del campo
      </p>

      {/* PRODUCTOS */}

      <div className="grid gap-4 md:max-w-3xl">

        {products.map((product) => (

          <ProductCard
            key={product.id}
            {...product}
            cantidad={
              carrito.find(p => p.id === product.id)?.cantidad || 0
            }
            onAdd={() =>
              actualizarCantidad(
                product,
                (carrito.find(p => p.id === product.id)?.cantidad || 0) + 1
              )
            }
            onRemove={() =>
              actualizarCantidad(
                product,
                (carrito.find(p => p.id === product.id)?.cantidad || 0) - 1
              )
            }
            onChange={(cantidad) =>
              actualizarCantidad(product, cantidad)
            }
          />

        ))}

      </div>

      {/* 🛒 CARRITO */}

      {carrito.length > 0 && (

        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-64 bg-white p-4 rounded-xl shadow-xl">

          <p className="font-bold">🛒 Pedido</p>

          <p className="text-sm">{carrito.length} productos</p>

          <p className="font-bold">
            L {total.toFixed(2)}
          </p>

          <button
            onClick={() => setMostrarCheckout(true)}
            className="mt-2 bg-green-600 text-white w-full p-2 rounded"
          >
            Finalizar
          </button>

        </div>

      )}

      {/* CHECKOUT */}

      {mostrarCheckout && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-3">
              Finalizar pedido
            </h2>

            <input
              placeholder="Nombre"
              className="border p-2 w-full mb-2 rounded"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              placeholder="Teléfono"
              className="border p-2 w-full mb-2 rounded"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />

            <input
              placeholder="Dirección"
              className="border p-2 w-full mb-3 rounded"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />

            <button
              onClick={finalizarPedido}
              className="bg-green-600 text-white w-full p-3 rounded"
            >
              Enviar pedido
            </button>

          </div>

        </div>

      )}

    </main>
  );
}