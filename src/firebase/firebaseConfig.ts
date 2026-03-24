// Importamos funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";

// Firestore será nuestra base de datos
import { getFirestore } from "firebase/firestore";

// Storage servirá para guardar imágenes de productos
import { getStorage } from "firebase/storage";

// Auth permitirá login para el panel admin
import { getAuth } from "firebase/auth";

/*
Configuración del proyecto Firebase.

Estos datos se obtienen en:
Firebase Console → Project Settings → General → Your Apps
*/

const firebaseConfig = {
  apiKey: "AIzaSyDjby4TQgXmJClmydNZL1o9vCJOA_3NyiM",
  authDomain: "lacteoseldon-4db78.firebaseapp.com",
  projectId: "lacteoseldon-4db78",
  storageBucket: "lacteoseldon-4db78.firebasestorage.app",
  messagingSenderId: "339374789636",
  appId: "1:339374789636:web:49b8f8098058a7465ad151"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

/*
Exportamos servicios que usaremos en la app
*/

export const db = getFirestore(app); // Base de datos
export const storage = getStorage(app); // Imágenes
export const auth = getAuth(app); // Autenticación