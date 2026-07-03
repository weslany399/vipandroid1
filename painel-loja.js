// js/painel-loja.js
import { app, database } from "./firebase-config.js";
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Inicia EmailJS
window.emailjs.init("Ej_yEvLwj43lDwajm");

const form = document.getElementById("formFunc");
const msgEl = document.getElementById("msg");

// ====================
// Funções de Modo e Idioma
// ====================

// Aplica tema claro ou escuro
function aplicarTema() {
  const tema = localStorage.getItem("tema") || "claro"; // valor padrão: claro
  if (tema === "escuro") {
    document.body.classList.add("modo-escuro");
    document.body.classList.remove("modo-claro");
  } else {
    document.body.classList.add("modo-claro");
    document.body.classList.remove("modo-escuro");
  }
}

// Aplica idioma baseado em configurações
function aplicarIdioma(traducoes) {
  const idioma = localStorage.getItem("idioma") || "pt"; // padrão: pt
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const chave = el.getAttribute("data-i18n");
    if (traducoes[idioma] && traducoes[idioma][chave]) {
      el.textContent = traducoes[idioma][chave];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const chave = el.getAttribute("data-i18n-placeholder");
    if (traducoes[idioma] && traducoes[idioma][chave]) {
      el.placeholder = traducoes[idioma][chave];
    }
  });
}

// ====================
// Mensagens do formulário
// ====================
function setMsg(txt, ok = false) {
  msgEl.textContent = txt;
  msgEl.className = "mensagem " + (ok ? "sucesso" : "erro");
}

// ====================
// Evento de envio do formulário
// ====================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setMsg("Cadastrando...", true);

  const nome = form.from_name.value.trim();
  const cpf = form.cpf.value.trim();
  const email = form.from_email.value.trim();
  const telefone = form.phone.value.trim();
  const senha = form.message.value.trim();

  if (!nome || !cpf || !email || !telefone || !senha) {
    setMsg("Preencha todos os campos.");
    return;
  }

  try {
    // Cria nova chave no Firebase
    const novoRef = push(dbRef(database, "funcionarios"));
    await set(novoRef, { 
      nome, 
      cpf, 
      email, 
      telefone, 
      senha,
      aprovado: false,
      token: ""
    });

    // Envia o e-mail via EmailJS
    await emailjs.sendForm("service_0osbn2i", "template_h6mz3zq", form);

    setMsg("Cadastro bem-sucedido! Aguarde aprovação.", true);
    form.reset();
  } catch (err) {
    console.error(err);
    setMsg("Erro no cadastro. Verifique seus dados.");
  }
});

// ====================
// Inicialização
// ====================
document.addEventListener("DOMContentLoaded", () => {
  aplicarTema();

  // Supondo que exista um objeto global "traducoes" carregado pelo global.js
  if (window.traducoes) {
    aplicarIdioma(window.traducoes);
  }
});
