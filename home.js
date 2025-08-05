import { database, app } from "./firebase-config.js";
import { ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

// --- Notificações Push (Ofertas do Dia) ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then(async registration => {
    const messaging = getMessaging(app);

    try {
      const token = await getToken(messaging, {
        vapidKey: "BMFskOn8o8fQLaSKYfDmCdaxku30fPIEa2LtPDrbTzZ6BohKRJf_z_rV5XU26SB092f6DTXpEgUUL7ae7ZX6tI0",
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log("🔔 Notificações ativadas para cliente:", token);
      } else {
        console.warn("⚠️ Nenhum token gerado.");
      }

      onMessage(messaging, payload => {
        console.log("📩 Notificação recebida com app aberto:", payload);
        const { title, body } = payload.notification || {};

        // Alerta simples para notificações enquanto o app está aberto
        alert(`${title || "Oferta do Dia!"}\n${body || "Confira agora mesmo."}`);
      });
    } catch (error) {
      console.error("❌ Erro ao configurar notificações:", error);
    }
  });
}

// --- PRODUTOS, BUSCA, FAVORITOS, CARRINHO ---
const produtosContainer = document.querySelector(".produtos-container");
const buscaInput = document.getElementById("busca");
const cartFloat = document.getElementById("cartFloat");

const favKey = "vipandroid_favoritos";
const getFavs = () => JSON.parse(localStorage.getItem(favKey) || "[]");
const setFavs = (arr) => localStorage.setItem(favKey, JSON.stringify(arr));

function montarDescricao(p) {
  const partes = [];
  if (p.armazenamento) partes.push(`${p.armazenamento}GB de armazenamento interno`);
  if (p.memoria) partes.push(`Memória RAM de ${p.memoria}GB`);
  if (p.tela) partes.push(`${p.tela}" de tela`);
  if (p.cameraTraseira) partes.push(`Câmera traseira de ${p.cameraTraseira}MP`);
  if (p.cameraFrontal) partes.push(`Câmera frontal de ${p.cameraFrontal}MP`);
  if (p.bateria) partes.push(`Bateria de ${p.bateria}mAh`);
  return partes.join(", ");
}

function renderizarProdutos(filtro = "") {
  const refProdutos = dbRef(database, "produtos");
  onValue(refProdutos, snap => {
    produtosContainer.innerHTML = "";
    const dados = snap.val();
    if (!dados) return;

    const termo = filtro.toLowerCase();
    const favs = getFavs();

    Object.entries(dados).reverse().forEach(([id, p]) => {
      const nome = (p.nome || "").toLowerCase();
      const marca = (p.marca || "").toLowerCase();
      if (!(nome.includes(termo) || marca.includes(termo))) return;

      const card = document.createElement("div");
      card.className = "produto-card";
      card.dataset.id = id;

      const imgURL = (p.fotosURLs && p.fotosURLs[0]) || p.fotoURL || "imagens/placeholder.jpg";
      const descricao = montarDescricao(p);

      const precoNormal = Number(p.preco);
      const precoAntigo = Number(p.precoAntigo);
      const precoOferta = Number(p.precoOferta);
      const temOferta = p.oferta && precoAntigo && precoOferta;

      const precoHTML = temOferta
        ? `
          <p class="preco-ant">R$ ${precoAntigo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          <p class="preco-oferta">R$ ${precoOferta.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        `
        : `<p class="preco">R$ ${precoNormal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>`;

      const freteHTML = p.freteGratis ? `<p class="frete">🚚Frete Grátis</p>` : "";
      const descricaoExtra = p.descricao ? `<p class="descricao-extra">${p.descricao}</p>` : "";
      const esgotadoHTML = p.quantidade == 0 ? `<div class="selo-esgotado">ESGOTADO</div>` : "";

      card.innerHTML = `
        <button class="fav-btn ${favs.includes(id) ? "" : "off"}">★</button>
        ${esgotadoHTML}
        <img src="${imgURL}" alt="${p.nome}">
        <h3><strong>${p.marca ?? ""} ${p.nome}</strong></h3>
        <p class="descricao">${descricao}</p>
        ${precoHTML}
        ${freteHTML}
        ${descricaoExtra}
      `;

      if (p.quantidade == 0) {
        card.classList.add("esgotado");
      }

      produtosContainer.appendChild(card);
    });
  });
}

buscaInput.addEventListener("input", () => renderizarProdutos(buscaInput.value));

produtosContainer.addEventListener("click", e => {
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    const id = favBtn.closest(".produto-card").dataset.id;
    let favs = getFavs();
    if (favs.includes(id)) {
      favs = favs.filter(x => x !== id);
      favBtn.classList.add("off");
    } else {
      favs.push(id);
      favBtn.classList.remove("off");
    }
    setFavs(favs);
    return;
  }

  const card = e.target.closest(".produto-card");
  if (card && !card.classList.contains("esgotado")) {
    location.href = `detalhes-produto.html?id=${card.dataset.id}`;
  }
});

function atualizarCarrinho() {
  const cart = JSON.parse(localStorage.getItem("vipandroid_carrinho") || "[]");
  cartFloat.classList.toggle("oculto", cart.length === 0);
}
window.addEventListener("storage", atualizarCarrinho);
atualizarCarrinho();

renderizarProdutos();
