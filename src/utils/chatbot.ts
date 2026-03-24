import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

/*
Obtiene configuración del chatbot
*/
export const obtenerMensajes = async () => {

  const ref = doc(db, "config", "chatbot");
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  }

  return null;
};