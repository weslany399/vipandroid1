import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const container = document.getElementById("favoritosContainer");
const msgSemFavoritos = document.getElementById("msgSemFavoritos");

async function carregarFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("vipandroid_favoritos") || "[]");

  container.innerHTML = "";
  msgSemFavoritos.style.display = "none";

  if (favoritos.length === 0) {
    msgSemFavoritos.style.display = "block";
    return;
  }

  const snap = await get(ref(database, "produtos"));
  const todosProdutos = snap.val();

  let encontrados = 0;

  favoritos.forEach(id => {
    const produto = todosProdutos[id];
    if (!produto) return;

    encontrados++;

    const precoAnt = Number(produto.precoAntigo || 0).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });
    const precoAtual = Number(produto.precoOferta || produto.preco).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    });

    const img = produto.fotosURLs?.[0] || "imagens/placeholder.jpg";
    const descricao = `${produto.armazenamento || ""}GB, RAM ${produto.memoria || ""}GB`.trim();

    const card = document.createElement("div");
    card.className = "produto-card";
    if (produto.quantidade == 0) card.classList.add("esgotado");

    card.innerHTML = `
      ${produto.quantidade == 0 ? '<div class="selo-esgotado">ESGOTADO</div>' : ""}
      <img src="${img}" alt="${produto.nome}">
      <h3>${produto.marca ?? ""} ${produto.nome ?? ""}</h3>
      <p class="descricao">${descricao}</p>
      ${
        produto.oferta
          ? `<p class="preco-ant">R$ ${precoAnt}</p><p class="preco-oferta">R$ ${precoAtual}</p>`
          : `<p class="preco">R$ ${precoAtual}</p>`
      }
      ${produto.freteGratis ? `<p class="frete">🚚 Frete Grátis</p>` : ""}
    `;

    card.addEventListener("click", () => {
      if (produto.quantidade > 0) {
        location.href = `detalhes-produto.html?id=${id}`;
      }
    });

    container.appendChild(card);
  });

  if (encontrados === 0) {
    msgSemFavoritos.style.display = "block";
  }
}

carregarFavoritos();
