/*
Servicio para gestionar pedidos en Firebase
*/

import { db } from "../firebase/firebaseConfig";

// funciones de Firestore
import { collection, addDoc, Timestamp } from "firebase/firestore";

/*
Función que guarda un pedido en la colección "pedidos"
*/

export const guardarPedido = async (pedido:any) => {

  try {

    // agregamos timestamp automático
    pedido.fecha = Timestamp.now();

    // guardamos documento
    const docRef = await addDoc(
      collection(db, "pedidos"),
      pedido
    );

    console.log("Pedido guardado con ID:", docRef.id);

    return docRef.id;

  } catch (error) {

    console.error("Error guardando pedido:", error);

    throw error;

  }

};