import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const container = document.getElementById("ofertasContainer");
const msgSemOfertas = document.getElementById("msgSemOfertas");

async function carregarOfertas() {
  try {
    const snap = await get(ref(database, "produtos"));
    container.innerHTML = "";
    msgSemOfertas.style.display = "none";

    if (!snap.exists()) {
      msgSemOfertas.style.display = "block";
      return;
    }

    const dados = snap.val();
    let ofertasEncontradas = false;

    Object.entries(dados).reverse().forEach(([id, produto]) => {
      if (!produto.oferta || produto.precoOferta == null) return;

      ofertasEncontradas = true;

      const precoAntigo = Number(produto.precoAntigo || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      });
      const precoAtual = Number(produto.precoOferta).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      });

      const img = produto.fotosURLs?.[0] || "imagens/placeholder.jpg";
      const descricao = `${produto.armazenamento || ""}GB, RAM ${produto.memoria || ""}GB`.trim();

      const card = document.createElement("div");
      card.className = "produto-card";
      if (produto.quantidade == 0) card.classList.add("esgotado");

      card.innerHTML = `
        <img src="${img}" alt="${produto.nome}">
        <h3>${produto.marca ?? ""} ${produto.nome ?? ""}</h3>
        <p class="descricao">${descricao}</p>
        <p class="preco-ant">R$ ${precoAntigo}</p>
        <p class="preco-oferta">R$ ${precoAtual}</p>
        ${produto.freteGratis ? `<p class="frete">🚚 Frete Grátis</p>` : ""}
      `;

      card.addEventListener("click", () => {
        if (produto.quantidade > 0) {
          location.href = `detalhes-produto.html?id=${id}`;
        }
      });

      container.appendChild(card);
    });

    if (!ofertasEncontradas) {
      msgSemOfertas.style.display = "block";
    }
  } catch (error) {
    console.error("Erro ao carregar ofertas:", error);
    container.innerHTML = "<p>Erro ao carregar as ofertas. Tente novamente.</p>";
  }
}

carregarOfertas();
