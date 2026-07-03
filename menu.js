// js/menu.js
import { auth } from "./firebase-config.js";

const menuBotao = document.getElementById("menuBotao");
const menuLateral = document.getElementById("menuLateral");

// Toggle menu
if (menuBotao && menuLateral) {
  menuBotao.addEventListener("click", () => {
    menuLateral.classList.toggle("show"); // 🔹 unificado com CSS
  });
}

// Protege cliques em links do menu lateral
if (menuLateral) {
  menuLateral.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) {
      if (!auth.currentUser) {
        e.preventDefault();
        window.location.href = "login.html";
      }
    }
  });
}
