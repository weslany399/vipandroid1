import { database } from "./firebase-config.js";
import { ref as dbRef, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

const produtosOfertasContainer = document.getElementById("produtosOfertas");
const produtosTodosContainer = document.getElementById("produtosTodos");
const produtosRecomendadosContainer = document.getElementById("produtosRecomendados");
const categoriasContainer = document.getElementById("categoriasCirculos");
const buscaInput = document.getElementById("busca");
const categoriaSelect = document.getElementById("filtroCategoria");

/* ===== LOGIN ===== */
let usuarioAtual = null;
onAuthStateChanged(auth, (user) => {
  usuarioAtual = user;
  console.log(user ? `✅ Usuário logado: ${user.email}` : "❌ Nenhum usuário logado");
});

function estaLogado() {
  return !!usuarioAtual;
}

function redirecionarParaLogin() {
  localStorage.setItem("redirectAfterLogin", window.location.pathname);
  window.location.href = "login.html";
}

/* ===== MENU LATERAL ===== */
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBotao");
  const menuLateral = document.querySelector(".menu-lateral");
  const overlay = document.querySelector(".overlay");

  if (menuBtn && menuLateral && overlay) {
    menuBtn.addEventListener("click", () => {
      menuLateral.classList.toggle("ativo");
      overlay.classList.toggle("ativo");
    });

    overlay.addEventListener("click", () => {
      menuLateral.classList.remove("ativo");
      overlay.classList.remove("ativo");
    });

    const opcoesMenu = menuLateral.querySelectorAll("a[data-require-login]");
    opcoesMenu.forEach(opcao => {
      opcao.addEventListener("click", (e) => {
        if (!estaLogado()) {
          e.preventDefault();
          redirecionarParaLogin();
        }
      });
    });
  }
});

/* ===== FAVORITOS ===== */
const favKey = "vipandroid_favoritos";
const getFavs = () => JSON.parse(localStorage.getItem(favKey) || "[]");
const setFavs = arr => localStorage.setItem(favKey, JSON.stringify(arr));

/* ===== IMAGENS DAS CATEGORIAS ===== */
const imagensCategoria = {
  celular: "/imagens/categorias/celular.png",
  notebook: "/imagens/categorias/notebook.png",
  tablet: "/imagens/categorias/tablet.png",
  "fone de ouvido": "/imagens/categorias/fone.png",
  fone: "/imagens/categorias/fone.png",
  "caixa de som": "/imagens/categorias/caixa-som.png",
  caixa: "/imagens/categorias/caixa-som.png",
  teclado: "/imagens/categorias/teclado.png",
  mouse: "/imagens/categorias/mouse.png",
  "controle de videogame": "/imagens/categorias/controle.png",
  controle: "/imagens/categorias/controle.png",
  "capinha / capa": "/imagens/categorias/capinha.png",
  capinha: "/imagens/categorias/capinha.png",
  película: "/imagens/categorias/pelicula.png",
  carregador: "/imagens/categorias/carregador.png",
  "pen drive / hd / ssd": "/imagens/categorias/pendrive.png",
  pendrive: "/imagens/categorias/pendrive.png",
  "fontes e cabos de energia": "/imagens/categorias/cabos.png",
  "fontes e cabos": "/imagens/categorias/cabos.png",
  "monitores e suportes": "/imagens/categorias/monitor.png",
  monitores: "/imagens/categorias/monitor.png",
  monitor: "/imagens/categorias/monitor.png",
  "cartão de memória": "/imagens/categorias/cartao.png",
  cartão: "/imagens/categorias/cartao.png",
  microfone: "/imagens/categorias/microfone.png",
  "ring light": "/imagens/categorias/ringlight.png",
  ringlight: "/imagens/categorias/ringlight.png",
  tripé: "/imagens/categorias/tripe.png",
  outros: "/imagens/categorias/outros.png"
};

/* ===== FORMATADORES ===== */
const formatadores = {
  celular: p => `
    ${p.armazenamento ? `Armazenamento interno de ${p.armazenamento}GB` : ""}
    ${p.memoria ? `<br>Memória RAM ${p.memoria}GB` : ""}
    ${p.tela ? `Tela: ${p.tela}"` : ""}
    ${p.bateria ? `<br>Bateria: ${p.bateria} mAh` : ""}
    ${p.cameraTraseira ? `<br>Câmera Traseira ${p.cameraTraseira}MP` : ""}
    ${p.cameraFrontal ? `<br>Câmera Frontal ${p.cameraFrontal}MP` : ""}
    ${p.sistemaOperacional ? `<br><strong>Sistema Operacional:</strong> ${p.sistemaOperacional}` : ""}
    ${p.modeloCPU ? `<br><strong>Modelo CPU:</strong> ${p.modeloCPU}` : ""}
    ${p.velocidadeCPU ? `<br><strong>Velocidade da CPU:</strong> ${p.velocidadeCPU}` : ""}
  `,
  notebook: p => `
    ${p["nb-cpu"] ? `CPU ${p["nb-cpu"]}` : ""}
    ${p["nb-ram"] ? `<br>RAM ${p["nb-ram"]}GB` : ""}
    ${p["nb-storage"] ? `<br>Armazenamento ${p["nb-storage"]}GB` : ""}
    ${p["nb-bateria"] ? `<br>Bateria ${p["nb-bateria"]}h` : ""}
    ${p["nb-gpu"] ? `GPU ${p["nb-gpu"]}` : ""}
    ${p["nb-tela"] ? `<br>Tela ${p["nb-tela"]}"` : ""}
    ${p["nb-teclado"] ? `Teclado ${p["nb-teclado"]}"` : ""}
    ${p["nb-audio"] ? `<br>Áudio ${p["nb-audio"]}"` : ""} 
    ${p["nb-conex"] ? `<br><strong>Conexões:</strong> ${p["nb-conex"]}"` : ""}
  `,
  tablet: p => `
    ${p["tab-cpu"] ? `CPU ${p["tab-cpu"]}` : ""}
    ${p["tab-tela"] ? `<br>Tela ${p["tab-tela"]}"` : ""}
    ${p["tab-ram"] ? `Memória RAM ${p["tab-ram"]}GB` : ""}
    ${p["tab-storage"] ? `<br>Armazenamento ${p["tab-storage"]}GB` : ""}
    ${p["tab-cameraT"] ? `<br>Câmera Traseira  ${p["tab-cameraT"]}MP` : ""}
    ${p["tab-cameraF"] ? `<br>Câmera Frontal  ${p["tab-cameraF"]}MP` : ""}
    ${p["tab-bateria"] ? `<br>Bateria ${p["tab-bateria"]} mAh` : ""}
    ${p["tab-conec"] ? `<br>Conectividade: ${p["tab-conec"]}"` : ""}
    ${p["tab-acess"] ? `<br><strong>Acessórios inclusos:</strong> ${p["tab-acess"]}"` : ""} 
  `,
  fone: p => `
    ${p["fone-tipo"] ? `Tipo: ${p["fone-tipo"]}` : ""}
    ${p["fone-batt"] ? `<br>Bateria ${p["fone-batt"]}h` : ""}
    ${p["fone-peso"] ? `Peso: ${p["fone-peso"]}` : ""}
    ${p["fone-conec"] ? `<br>Conectividade: ${p["fone-conec"]}` : ""}
    ${p["fone-audio"] ? `<br>Qualidade de áudio: ${p["fone-audio"]}` : ""}
    ${p["fone-mic"] ? `<br>Microfone: ${p["fone-mic"]}` : ""} 
    ${p["fone-itens"] ? `<br><strong>Itens Inclusos:</strong>  ${p["fone-itens"]}` : ""} 
  `,
   caixaSom: p => `
    ${p["som-modelo"] ? `Modelo: ${p["som-modelo"]}` : ""}
    ${p["som-pot"] ? `<br>Potência: ${p["som-pot"]}` : ""}
    ${p["som-tipo"] ? `<br>Tipo de som: ${p["som-tipo"]}` : ""}
    ${p["som-batt"] ? `<br>Bateria ${p["som-batt"]}mAh` : ""}
    ${p["som-conec"] ? `<br><strong>Conectividade:</strong>  ${p["som-conec"]}` : ""}
  `,
  teclado: p => `
    ${p["tecl-modelo"] ? `Modelo ${p["tecl-modelo"]}` : ""}
    ${p["tecl-tipo"] ? `<br>Tipo: ${p["tecl-tipo"]}` : ""}
    ${p["tecl-layout"] ? `<br>Layout: ${p["tecl-layout"]}` : ""}
    ${p["tecl-back"] ? `<br>Backlight / Iluminação: ${p["tecl-back"]}` : ""}
  `,
  mouse: p => `
    ${p["mouse-modelo"] ? `Modelo ${p["mouse-modelo"]}` : ""}
    ${p["mouse-tipo"] ? `<br>Tipo: ${p["mouse-tipo"]}` : ""}
    ${p["mouse-dpi"] ? `<br>DPI / Resolução: ${p["mouse-dpi"]}` : ""}
    ${p["mouse-botoes"] ? `<br>Nº de botões: ${p["mouse-botoes"]}` : ""}
  `,
  controle: p => `
    ${p["ctl-modelo"] ? `Modelo ${p["ctl-modelo"]}` : ""}
    ${p["ctl-tipo"] ? `<br>Tipo: ${p["ctl-tipo"]}` : ""}
    ${p["ctl-compat"] ? `<br><strong>Compatibilidade:</strong> ${p["ctl-compat"]}` : ""}
  `,
  capinha: p => `
    ${p["cap-compat"] ? `Compatível com ${p["cap-compat"]}` : ""}
    ${p["cap-material"] ? `<br>Material: ${p["cap-material"]}` : ""}
    ${p["cap-recursos"] ? `<br><strong>Recursos:</strong> ${p["cap-recursos"]}` : ""}
  `,
  pelicula: p => `
    ${p["pel-modelo"] ? `Modelo compatível com ${p["pel-modelo"]}` : ""}
    ${p["pel-tipo"] ? `<br>Tipo: ${p["pel-tipo"]}` : ""}
    ${p["pel-recursos"] ? `<br><strong>Recursos:</strong> ${p["pel-recursos"]}` : ""}
  `,
  carregador: p => `
    ${p["chg-modelo"] ? `Modelo ${p["chg-modelo"]}` : ""}
    ${p["chg-tipo"] ? `<br>Tipo: ${p["chg-tipo"]}` : ""}
    ${p["chg-pot"] ? `<br>Potência: ${p["chg-pot"]}` : ""}
    ${p["chg-comp"] ? `<br><strong>Compatibilidade:</strong> ${p["chg-comp"]}` : ""}
  `,
  pendrive: p => `
    ${p["arm-cap"] ? `Capacidade ${p["arm-cap"]}` : ""}
    ${p["arm-interface"] ? `<br>Interface: ${p["arm-interface"]}` : ""}
    ${p["arm-vel"] ? `<br>Velocidade leitura/gravação ${p["arm-vel"]}` : ""}
    ${p["arm-seg"] ? `<br>Segurança ${p["arm-seg"]}` : ""}
  `,
  fontesCabos: p => `
    ${p["fc-entrada"] ? `Entrada ${p["fc-entrada"]}` : ""}
    ${p["fc-saida"] ? `<br>Saída / Potência: ${p["fc-saida"]}` : ""}
    ${p["fc-conector"] ? `<br>Conector ${p["fc-conector"]}` : ""}
  `,
  monitor: p => `
    ${p["mon-tam"] ? `Tamanho: ${p["mon-tam"]}` : ""}
    ${p["mon-res"] ? `<br>Resolução ${p["mon-res"]}` : ""}
    ${p["mon-refresh"] ? `<br>Taxa de atualização ${p["mon-refresh"]}` : ""}
    ${p["mon-painel"] ? `<br>Tipo de painel: ${p["mon-painel"]}` : ""}
    ${p["mon-rec"] ? `<br><strong>Recursos:</strong> ${p["mon-rec"]}` : ""}
  `,
  cartaoMemoria: p => `
    ${p["cm-cap"] ? `Capacidade: ${p["cm-cap"]}` : ""}
    ${p["cm-vel"] ? `<br>Classe / Velocidade ${p["cm-vel"]}` : ""}
    ${p["cm-comp"] ? `<br><strong>Compatibilidade::</strong> ${p["cm-comp"]}` : ""}
  `,
  microfone: p => `
    ${p["mic-model"] ? `Modelo ${p["mic-model"]}` : ""}
    ${p["mic-tipo"] ? `<br>Tipo: ${p["mic-tipo"]}` : ""}
    ${p["mic-conec"] ? `<br><strong>Conectividade:</strong> ${p["mic-conec"]}` : ""}
  `,
  ringlight: p => `
    ${p["rl-tam"] ? `Diâmetro / Tamanho: ${p["rl-tam"]}` : ""}
    ${p["rl-temp"] ? `<br>Temperatura de cor ${p["rl-temp"]}` : ""}
    ${p["rl-acess"] ? `<br>><strong>Acessórios inclusos:</strong> ${p["rl-acess"]}` : ""}
  `,
  tripe: p => `
    ${p["trp-alt"] ? `Altura máxima/min: ${p["trp-alt"]}` : ""}
    ${p["trp-material"] ? `<br>Material ${p["trp-material"]}` : ""}
    ${p["trp-comp"] ? `<br>><strong>Compatibilidade:></strong> ${p["trp-comp"]}` : ""}
  `,
  outros: p => `
    ${p["out-modelo"] ? `Modelo ${p["out-modelo"]}` : ""}
    ${p["out-cat"] ? `<br>Categoria: ${p["out-cat"]}` : ""}
    ${p["out-espec"] ? `<br>Especificações técnicas: ${p["out-espec"]}` : ""}
  `
};

/* ===== FIREBASE ===== */
let todosProdutos = {};
let categoriaFiltrada = "";

onValue(dbRef(database, "produtos"), snap => {
  todosProdutos = snap.val() || {};
  carregarCategorias();
  renderizarTudo();
});

/* ===== CATEGORIAS ===== */
function carregarCategorias() {
  const categorias = new Set(
    Object.values(todosProdutos)
      .map(p => (p.categoria || "").toLowerCase().trim())
      .filter(Boolean)
  );

  categoriaSelect.innerHTML = '<option value="">Todas</option>';
  categorias.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoriaSelect.appendChild(option);
  });

  renderizarCategoriasCirculos(Array.from(categorias));
}

function renderizarCategoriasCirculos(categorias) {
  categoriasContainer.innerHTML = "";
  categorias.forEach(cat => {
    const circulo = document.createElement("div");
    circulo.className = "categoria-circulo";
    
    const icone = document.createElement("div");
    icone.className = "categoria-icone";
    
    const img = document.createElement("img");
    const imagemSrc = imagensCategoria[cat] || imagensCategoria["outros"];
    img.src = imagemSrc;
    img.alt = cat;
    img.loading = "lazy";
    
    img.onerror = function() {
      this.style.display = 'none';
      const fallback = document.createElement('span');
      fallback.textContent = "📦";
      fallback.style.fontSize = "28px";
      icone.appendChild(fallback);
    };
    
    icone.appendChild(img);
    
    const nome = document.createElement("div");
    nome.className = "categoria-nome";
    nome.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    
    circulo.append(icone, nome);
    
    circulo.addEventListener("click", () => {
      categoriaFiltrada = cat;
      categoriaSelect.value = cat;
      renderizarTudo();
      document.querySelector(".secao-produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    
    categoriasContainer.appendChild(circulo);
  });
}

/* ===== RENDER ===== */
function renderizarTudo() {
  const termo = buscaInput?.value.trim().toLowerCase() || "";
  const catSel = categoriaSelect?.value || categoriaFiltrada || "";
  renderizarOfertas(termo, catSel);
  renderizarRecomendados();
  renderizarTodosProdutos(termo, catSel);
}

function renderizarOfertas(termo = "", catSel = "") {
  produtosOfertasContainer.innerHTML = "";
  const favs = getFavs();
  const produtosArray = Object.entries(todosProdutos)
    .reverse()
    .filter(([id, p]) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase().trim();
      const temOferta = !!(p.precoAntigo && p.precoAntigo > p.preco);
      if (!temOferta) return false;
      if (termo && !nome.includes(termo)) return false;
      if (catSel && catSel !== categoria) return false;
      return true;
    });

  produtosArray.forEach(([id, p]) => {
    const card = criarCard(id, p, favs);
    produtosOfertasContainer.appendChild(card);
  });

  if (produtosArray.length === 0) {
    produtosOfertasContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Nenhuma oferta disponível no momento</p>';
  }
}

function renderizarRecomendados() {
  produtosRecomendadosContainer.innerHTML = "";
  const favs = getFavs();
  
  // Pegar produtos com fotos e embaralhar
  const produtosComFoto = Object.entries(todosProdutos)
    .filter(([id, p]) => {
      const temFoto = (p.fotosURLs && p.fotosURLs[0]) || p.fotoURL;
      return temFoto && p.preco;
    })
    .sort(() => Math.random() - 0.5) // Embaralhar aleatoriamente
    .slice(0, 6); // Pegar apenas 6 produtos

  produtosComFoto.forEach(([id, p]) => {
    const card = criarCard(id, p, favs);
    produtosRecomendadosContainer.appendChild(card);
  });

  if (produtosComFoto.length === 0) {
    produtosRecomendadosContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Nenhum produto recomendado no momento</p>';
  }
}

function renderizarTodosProdutos(termo = "", catSel = "") {
  produtosTodosContainer.innerHTML = "";
  const favs = getFavs();
  const produtosArray = Object.entries(todosProdutos)
    .reverse()
    .filter(([id, p]) => {
      const nome = (p.nome || "").toLowerCase();
      const categoria = (p.categoria || "").toLowerCase().trim();
      const temOferta = !!(p.precoAntigo && p.precoAntigo > p.preco);
      if (temOferta) return false;
      if (termo && !nome.includes(termo)) return false;
      if (catSel && catSel !== categoria) return false;
      return true;
    });

  produtosArray.forEach(([id, p]) => {
    const card = criarCard(id, p, favs);
    produtosTodosContainer.appendChild(card);
  });

  if (produtosArray.length === 0) {
    produtosTodosContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Nenhum produto encontrado</p>';
  }
}

/* ===== FUNÇÃO AUXILIAR PARA TRUNCAR TEXTO ===== */
function truncarTexto(htmlString, limite = 120) {
  const textoLimpo = htmlString.replace(/<br>/g, " ").replace(/<[^>]+>/g, "").trim();
  if (textoLimpo.length <= limite) return htmlString;
  const cortado = textoLimpo.substring(0, limite).trim() + "...";
  return cortado;
}

/* ===== CRIAR CARD ===== */
function criarCard(id, p, favs) {
  const imgURL = (p.fotosURLs && p.fotosURLs[0]) || p.fotoURL || "imagens/placeholder.jpg";
  const categoria = (p.categoria || "").toLowerCase().trim();
  const detalhesHTML = formatadores[categoria]?.(p) || "";
  const detalhesTruncados = truncarTexto(detalhesHTML, 120);
  const estado = p.estado ? p.estado.charAt(0).toUpperCase() + p.estado.slice(1) : "";
  const estadoClasse = estado ? `estado-${estado.toLowerCase()}` : "";

  let precoAtual = "", precoAntigo = "";
  if (p.preco && !isNaN(p.preco)) precoAtual = Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  if (p.precoAntigo && !isNaN(p.precoAntigo)) precoAntigo = Number(p.precoAntigo).toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  const temOferta = !!(p.precoAntigo && p.precoAntigo > p.preco);

  const nota = p.avaliacao || 4.5;
  const estrelas = "★".repeat(Math.floor(nota)) + (nota % 1 >= 0.5 ? "½" : "");

  const card = document.createElement("div");
  card.className = "produto-card";
  card.dataset.id = id;

  const clickableArea = document.createElement("div");
  clickableArea.className = "clickable-area";

  const img = document.createElement("img");
  img.src = imgURL;
  img.alt = p.nome || "";
  img.loading = "lazy";

  const titulo = document.createElement("h3");
  titulo.textContent = `${p.marca || ""} ${p.nome || ""}`.trim();
  clickableArea.append(img, titulo);

  if (estado) {
    const estadoP = document.createElement("p");
    estadoP.className = `estado ${estadoClasse}`;
    estadoP.textContent = estado;
    clickableArea.appendChild(estadoP);
  }

  if (detalhesHTML) {
    const detalhesDiv = document.createElement("div");
    detalhesDiv.className = "detalhes-extra";
    detalhesDiv.innerHTML = detalhesTruncados;
    detalhesDiv.title = detalhesHTML.replace(/<br>/g, "\n").replace(/<[^>]+>/g, "");
    clickableArea.appendChild(detalhesDiv);
  }

  if (p.descricao) {
    const descP = document.createElement("p");
    descP.className = "descricao-adicional";
    descP.textContent = p.descricao;
    clickableArea.appendChild(descP);
  }

  const precosDiv = document.createElement("div");
  precosDiv.className = "precos";
  if (precoAntigo) precosDiv.innerHTML += `<span class="preco-antigo">R$ ${precoAntigo}</span><br>`;
  if (precoAtual) precosDiv.innerHTML += `<span class="${temOferta ? "preco-oferta" : "preco-normal"}">R$ ${precoAtual}</span>`;
  clickableArea.appendChild(precosDiv);

  const avaliacaoDiv = document.createElement("div");
  avaliacaoDiv.className = "avaliacao";
  avaliacaoDiv.textContent = `⭐ ${nota} (${estrelas})`;
  clickableArea.appendChild(avaliacaoDiv);

  clickableArea.addEventListener("click", () => {
    if (!estaLogado()) {
      redirecionarParaLogin();
      return;
    }
    window.location.href = `detalhes-produto.html?id=${id}`;
  });

  card.appendChild(clickableArea);

  const topoCard = document.createElement("div");
  topoCard.className = "topo-card";

  if (temOferta) {
    const selo = document.createElement("span");
    selo.className = "selo-oferta";
    selo.textContent = "OFERTA";
    card.appendChild(selo);
  }

  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn";
  if (!favs.includes(id)) favBtn.classList.add("off");
  favBtn.textContent = "★";
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const favs = getFavs();
    if (favs.includes(id)) {
      setFavs(favs.filter(f => f !== id));
      favBtn.classList.add("off");
    } else {
      favs.push(id);
      setFavs(favs);
      favBtn.classList.remove("off");
    }
  });

  const shareBtn = document.createElement("button");
  shareBtn.className = "share-btn";
  shareBtn.title = "Compartilhar";
  shareBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 2.5a2.5 2.5 0 1 0-2.496 2.5l-4.005 2.002a2.5 2.5 0 1 0 0 3.992l4.005 2.002a2.5 2.5 0 1 0 .491-.825l-4.005-2.002a2.5 2.5 0 0 0 0-1.34l4.005-2.002A2.5 2.5 0 0 0 11 2.5z"/>
  </svg>`;

  shareBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const produtoURL = `https://vip-android-746dd.web.app/detalhes-produto.html?id=${id}`;
    const textoDetalhes = detalhesHTML.replace(/<br>/g, "\n").replace(/<[^>]*>/g, "");

    try {
      if (navigator.canShare && p.fotosURLs && p.fotosURLs[0]) {
        const resp = await fetch(p.fotosURLs[0]);
        const blob = await resp.blob();
        const file = new File([blob], "produto.jpg", { type: blob.type });
        const shareData = {
          title: `${p.marca || ""} ${p.nome || ""}`,
          text: textoDetalhes,
          url: produtoURL,
          files: [file]
        };
        if (navigator.canShare({ files: [file] })) {
          await navigator.share(shareData);
          return;
        }
      }

      await navigator.clipboard.writeText(produtoURL);
      window.open(imgURL, "_blank");
      alert("Link do produto copiado! A imagem foi aberta em outra aba.");
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
      alert("Não foi possível compartilhar o produto.");
    }
  });

  topoCard.append(favBtn, shareBtn);
  card.appendChild(topoCard);

  return card;
}

/* ===== EVENTOS ===== */
buscaInput?.addEventListener("input", renderizarTudo);
categoriaSelect?.addEventListener("change", () => {
  categoriaFiltrada = categoriaSelect.value;
  renderizarTudo();
});