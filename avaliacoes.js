import { database } from "./firebase-config.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const form = document.getElementById("formAvaliacao");
const lista = document.getElementById("listaAvaliacoes");

// Função para criar estrelas em HTML
function criarEstrelas(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// Envio do formulário
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const estrelas = document.querySelector('input[name="estrela"]:checked')?.value;
  const comentario = document.getElementById("comentario").value.trim();
  const nome = document.getElementById("nomeCliente").value.trim() || "Anônimo";

  if (!estrelas || !comentario) {
    alert("Por favor, selecione uma quantidade de estrelas e escreva um comentário.");
    return;
  }

  try {
    await push(ref(database, "avaliacoes"), {
      estrelas: Number(estrelas),
      comentario,
      nome,
      data: new Date().toISOString()
    });

    form.reset();
    alert("Obrigado pela sua avaliação!");
  } catch (err) {
    console.error("Erro ao enviar avaliação:", err);
    alert("Não foi possível enviar sua avaliação. Tente novamente.");
  }
});

// Carregar avaliações em tempo real
onValue(ref(database, "avaliacoes"), (snap) => {
  lista.innerHTML = '<h3 style="margin-top: 30px;">📣 Avaliações Recentes</h3>';
  if (!snap.exists()) return;

  // Inverte para mostrar mais recentes primeiro
  const dados = Object.values(snap.val()).sort((a, b) => new Date(b.data) - new Date(a.data));

  dados.forEach(av => {
    const div = document.createElement("div");
    div.className = "comentario";
    div.innerHTML = `
      <div class="estrelas">
        ${criarEstrelas(av.estrelas)}
      </div>
      <p><strong>${av.nome}</strong>: ${av.comentario}</p>
      <small style="color:#888;">${new Date(av.data).toLocaleString()}</small>
    `;
    lista.appendChild(div);
  });
});
