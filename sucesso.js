// js/sucesso.js

import { app } from "./firebase-config.js";
import {
  getFirestore,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Inicializa Firestore com o app já configurado
const firestore = getFirestore(app);

// Pega o ID da venda da URL (ex: sucesso.html?idVenda=abc123)
const urlParams = new URLSearchParams(window.location.search);
const idVenda = urlParams.get("idVenda");

if (!idVenda) {
  console.warn("❌ ID da venda não encontrado na URL.");
} else {
  const vendaRef = doc(firestore, "vendas", idVenda);

  // Escuta a venda no Firestore
  const unsubscribe = onSnapshot(vendaRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("❌ Venda não encontrada no Firestore.");
      return;
    }

    const dados = docSnap.data();
    console.log("🟡 Status da venda:", dados.status);

    if (dados.status === "approved") {
      console.log("✅ Venda aprovada. Limpando carrinho...");

      // Limpa o carrinho e o checkout
      localStorage.removeItem("vipandroid_carrinho");
      localStorage.removeItem("vipandroid_checkout");

      // Exibe mensagem de sucesso, se houver container
      const msg = document.getElementById("mensagemSucesso");
      if (msg) {
        msg.textContent = "Compra aprovada com sucesso! Obrigado.";
      }

      unsubscribe(); // Para de escutar após a aprovação
    }
  });
}
