import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ---------- referências de elementos ---------- */
const params     = new URLSearchParams(location.search);
const id         = params.get("id");
const imgAtiva   = document.getElementById("imgAtiva");
const prevBtn    = document.getElementById("prevImg");
const nextBtn    = document.getElementById("nextImg");
const infoBox    = document.getElementById("info");
const addBtn     = document.getElementById("adicionarCarrinho");
const cartFloat  = document.getElementById("cartFloat");

let fotos = [];
let idx   = 0;

/* -------- frase estilo Magazine Luiza -------- */
function montarDescricao(p) {
  const partes = [];

  if (p.marca || p.nome) {
    partes.push(`${(p.marca ?? "")} ${(p.nome ?? "")}`.trim());
  }

  if (p.armazenamento) partes.push(`${p.armazenamento}GB de armazenamento interno`);
  if (p.memoria)       partes.push(`Memória RAM de ${p.memoria}GB`);
  if (p.tela)          partes.push(`${p.tela}" de tela`);

  if (p.cameraTraseira) {
    const arr = p.cameraTraseira.split("+").map(x => x.trim()).filter(Boolean);
    const label = arr.length === 1 ? "Câmera traseira de" :
                  arr.length === 2 ? "Câmera traseira dupla de" :
                  arr.length === 3 ? "Câmera traseira tripla de" : "Câmera traseira múltipla de";
    partes.push(`${label} ${arr.join("+")}MP`);
  }

  if (p.cameraFrontal) partes.push(`Câmera frontal de ${p.cameraFrontal}MP`);
  if (p.bateria)       partes.push(`Bateria de ${p.bateria}mAh`);

  return partes.join(", ");
}

/* -------- carrega dados do Firebase e monta tela -------- */
async function carregarProduto() {
  const snap = await get(ref(database, `produtos/${id}`));
  if (!snap.exists()) {
    infoBox.textContent = "Produto não encontrado.";
    return;
  }

  const p = snap.val();

  /* ----- carrossel ----- */
  fotos = Array.isArray(p.fotosURLs) && p.fotosURLs.length ? p.fotosURLs : ["imagens/placeholder.jpg"];
  idx = 0;
  mostrarFoto();

  /* ----- preço e oferta ----- */
  let precoHTML = "";
  if (p.oferta && p.precoAntigo && p.precoOferta) {
    precoHTML = `
      <p class="preco-ant">R$ ${Number(p.precoAntigo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      <p class="preco-oferta">R$ ${Number(p.precoOferta).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
    `;
  } else {
    precoHTML = `<p class="preco">R$ ${Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>`;
  }

  /* ----- frete grátis ----- */
  const freteHTML = p.freteGratis ? `<p class="frete">🚚Frete Grátis</p>` : "";

  /* ----- frase automática + descrição extra ----- */
  const descricao  = montarDescricao(p);
  const extraHTML  = p.descricao ? `<p style="color:#555;font-style:italic;">${p.descricao}</p>` : "";

  /* ----- cores com bolinhas selecionáveis ----- */
  let coresHTML = "";
  if (Array.isArray(p.coresDetalhadas) && p.coresDetalhadas.length) {
    coresHTML = `
      <div class="cores-disponiveis" id="listaCores">
        ${p.coresDetalhadas.map((c, i) => 
          `<div class="cor-item" data-index="${i}">
            <div class="cor-bolinha" style="background:${c.cor || "#ccc"}"></div>
            ${c.nome || ""}
          </div>`
        ).join("")}
      </div>
    `;
  }

  /* ----- inject HTML ----- */
  infoBox.innerHTML = `
    <p class="descricao">${descricao}</p>
    ${coresHTML}
    ${precoHTML}
    ${freteHTML}
    ${extraHTML}
  `;

  // Evento de seleção de cor
  const corItens = document.querySelectorAll(".cor-item");
  corItens.forEach(item => {
    item.addEventListener("click", () => {
      corItens.forEach(i => i.classList.remove("selecionada"));
      item.classList.add("selecionada");
    });
  });
}

/* -------- funções do carrossel -------- */
function mostrarFoto() {
  imgAtiva.src = fotos[idx];
}

prevBtn.onclick = () => {
  if (fotos.length > 1) {
    idx = (idx - 1 + fotos.length) % fotos.length;
    mostrarFoto();
  }
};
nextBtn.onclick = () => {
  if (fotos.length > 1) {
    idx = (idx + 1) % fotos.length;
    mostrarFoto();
  }
};

/* -------- zoom / fullscreen -------- */
imgAtiva.onclick = () => {
  const full = document.createElement("img");
  full.src = fotos[idx];
  full.style = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    object-fit:contain;background:#000;z-index:9999;cursor:zoom-out;
  `;
  full.onclick = () => full.remove();
  document.body.appendChild(full);
};

/* -------- carrinho -------- */
addBtn.onclick = async () => {
  try {
    const snap = await get(ref(database, `produtos/${id}`));
    if (!snap.exists()) {
      alert("Produto não encontrado no banco.");
      return;
    }
    const produto = snap.val();
    const estoqueDisponivel = produto.quantidade || 1;

    const carrinho = JSON.parse(localStorage.getItem("vipandroid_checkout") || "[]");
    const idxExistente = carrinho.findIndex(p => p.id === id);

    if (idxExistente > -1) {
      const quantidadeAtual = carrinho[idxExistente].quantidade || 1;

      if (quantidadeAtual >= estoqueDisponivel) {
        alert("Você já adicionou todos os itens disponíveis em estoque.");
        return;
      }

      const confirmarMaisUm = confirm("Este item já está no carrinho. Deseja adicionar mais um?");
      if (!confirmarMaisUm) return;
      carrinho[idxExistente].quantidade++;
    } else {
      const confirmarNovo = confirm("Você deseja adicionar este item ao carrinho?");
      if (!confirmarNovo) return;

      carrinho.push({
        id,
        ...produto,
        quantidade: 1,
        estoqueDisponivel
      });
    }

    localStorage.setItem("vipandroid_checkout", JSON.stringify(carrinho));
    alert("Produto adicionado ao carrinho!");
    location.href = "carrinho.html";
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    alert("Erro ao adicionar produto ao carrinho.");
  }
};

/* -------- carrinho flutuante -------- */
function atualizarCarrinhoFloat() {
  const c = JSON.parse(localStorage.getItem("vipandroid_checkout") || "[]");
  cartFloat.classList.toggle("oculto", c.length === 0);
}
window.addEventListener("storage", atualizarCarrinhoFloat);

/* -------- inicialização -------- */
atualizarCarrinhoFloat();
carregarProduto();
