// js/painel-loja.js
import { app, database } from "./firebase-config.js";
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Inicia EmailJS
window.emailjs.init("Ej_yEvLwj43lDwajm");

const form = document.getElementById("formFunc");
const msgEl = document.getElementById("msg");

function setMsg(txt, ok = false) {
  msgEl.textContent = txt;
  msgEl.className = "mensagem " + (ok ? "sucesso" : "erro");
}

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
    // Cria uma nova chave automaticamente e já define aprovado: false e token vazio
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

    // Envia o e‑mail via EmailJS
    await emailjs.sendForm("service_0osbn2i", "template_h6mz3zq", form);

    setMsg("Cadastro bem-sucedido! Aguarde aprovação.", true);
    form.reset();
  } catch (err) {
    console.error(err);
    setMsg("Erro no cadastro. Verifique seus dados.");
  }
});
