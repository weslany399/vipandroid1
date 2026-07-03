import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Elementos principais
const container = document.getElementById("ofertasContainer");
const msgSemOfertas = document.getElementById("msgSemOfertas");

// Função para carregar ofertas
async function carregarOfertas() {
  try {
    const snap = await get(ref(database, "produtos"));
    container.innerHTML = "";
    msgSemOfertas.style.display = "none";

    if (!snap.exists()) {
      msgSemOfertas.style.display = "block";
      aplicarIdiomaNaPagina(); // atualiza texto traduzido
      return;
    }

    const dados = snap.val();
    let ofertasEncontradas = false;

    Object.entries(dados)
      .reverse()
      .forEach(([id, produto]) => {
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
          <p class="preco-ant" data-i18n="preco_antigo">R$ ${precoAntigo}</p>
          <p class="preco-oferta" data-i18n="preco_oferta">R$ ${precoAtual}</p>
          ${produto.freteGratis ? `<p class="frete" data-i18n="frete_gratis">🚚 Frete Grátis</p>` : ""}
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

    aplicarIdiomaNaPagina(); // atualiza traduções
  } catch (error) {
    console.error("Erro ao carregar ofertas:", error);
    container.innerHTML = `<p data-i18n="erro_ofertas">Erro ao carregar as ofertas. Tente novamente.</p>`;
    aplicarIdiomaNaPagina();
  }
}

// ✅ Função para aplicar tema claro/escuro automaticamente
function aplicarTema() {
  const temaSalvo = localStorage.getItem("tema") || "claro";
  document.body.classList.toggle("escuro", temaSalvo === "escuro");
}

// ✅ Função para aplicar idioma (baseada no global.js)
function aplicarIdiomaNaPagina() {
  const idioma = localStorage.getItem("idioma") || "pt";
  if (window.traduzirPagina) {
    window.traduzirPagina(idioma);
  }
}

// ✅ Observa mudanças no localStorage (sincroniza entre abas/páginas)
window.addEventListener("storage", (event) => {
  if (event.key === "tema") aplicarTema();
  if (event.key === "idioma") aplicarIdiomaNaPagina();
});

// ✅ Inicialização
document.addEventListener("DOMContentLoaded", () => {
  aplicarTema();
  carregarOfertas();
  aplicarIdiomaNaPagina();
});
