// js/firebase-config.js

// Importa os módulos do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfQdAX3P6VU7GWMIK5pLq7IYRuTimDvvo",
  authDomain: "vip-android-746dd.firebaseapp.com",
  databaseURL: "https://vip-android-746dd-default-rtdb.firebaseio.com",
  projectId: "vip-android-746dd",
  storageBucket: "vip-android-746dd.appspot.com",
  messagingSenderId: "1095417596528",
  appId: "1:1095417596528:web:5a8a835451989808918265"
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços
export { app };
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
