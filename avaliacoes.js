import { database } from "./firebase-config.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const form = document.getElementById("formAvaliacao");
const lista = document.getElementById("listaAvaliacoes");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const estrelas = document.querySelector('input[name="estrela"]:checked')?.value;
  const comentario = document.getElementById("comentario").value.trim();
  const nome = document.getElementById("nomeCliente").value.trim() || "Anônimo";

  if (!estrelas || !comentario) {
    alert("Por favor, selecione uma quantidade de estrelas e escreva um comentário.");
    return;
  }

  await push(ref(database, "avaliacoes"), {
    estrelas: Number(estrelas),
    comentario,
    nome,
    data: new Date().toISOString()
  });

  form.reset();
  alert("Obrigado pela sua avaliação!");
});

// Carrega avaliações
onValue(ref(database, "avaliacoes"), (snap) => {
  lista.innerHTML = '<h3 style="margin-top: 30px;">📣 Avaliações Recentes</h3>';
  if (!snap.exists()) return;

  const dados = Object.values(snap.val()).reverse();
  dados.forEach(av => {
    const div = document.createElement("div");
    div.className = "comentario";
    div.innerHTML = `
      <div class="estrelas">
        ${'★'.repeat(av.estrelas)}${'☆'.repeat(5 - av.estrelas)}
      </div>
      <p><strong>${av.nome}</strong>: ${av.comentario}</p>
    `;
    lista.appendChild(div);
  });
});
