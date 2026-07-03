import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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
    ${p["tab-cameraF"] ? `<br>Câmera Frontal  ${p["tab-cameraF"]}MP` : ""}a
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

  armazenamento: p => `
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
 

/* ===== ELEMENTOS DOM ===== */
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
let corSelecionada = null;

/* -------- função de notificação -------- */
function mostrarNotificacao(msg) {
  const notif = document.getElementById("notificacao");
  notif.textContent = msg;
  notif.style.display = "block";
  setTimeout(() => { notif.style.display = "none"; }, 2000);
}

/* -------- carrossel -------- */
function mostrarFoto() { imgAtiva.src = fotos[idx]; }
prevBtn.onclick = () => { if(fotos.length>1){ idx=(idx-1+fotos.length)%fotos.length; mostrarFoto(); }};
nextBtn.onclick = () => { if(fotos.length>1){ idx=(idx+1)%fotos.length; mostrarFoto(); }};
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

/* -------- atualizar meta tags -------- */
function atualizarMetaTags(p) {
  const urlAtual = location.href;
  const img = Array.isArray(p.fotosURLs) && p.fotosURLs.length ? p.fotosURLs[0] : "imagens/placeholder.jpg";

  // Open Graph
  if(document.querySelector('meta[property="og:title"]')) document.querySelector('meta[property="og:title"]').setAttribute("content", p.nome || "Produto VipAndroid");
  if(document.querySelector('meta[property="og:description"]')) document.querySelector('meta[property="og:description"]').setAttribute("content", p.descricao || "");
  if(document.querySelector('meta[property="og:image"]')) document.querySelector('meta[property="og:image"]').setAttribute("content", img);
  if(document.querySelector('meta[property="og:url"]')) document.querySelector('meta[property="og:url"]').setAttribute("content", urlAtual);

  // Twitter
  if(document.querySelector('meta[name="twitter:title"]')) document.querySelector('meta[name="twitter:title"]').setAttribute("content", p.nome || "Produto VipAndroid");
  if(document.querySelector('meta[name="twitter:description"]')) document.querySelector('meta[name="twitter:description"]').setAttribute("content", p.descricao || "");
  if(document.querySelector('meta[name="twitter:image"]')) document.querySelector('meta[name="twitter:image"]').setAttribute("content", img);

  document.title = p.nome || "Detalhes do Produto";
}

/* -------- carregar produto -------- */
async function carregarProduto() {
  const snap = await get(ref(database, `produtos/${id}`));
  if (!snap.exists()) { infoBox.textContent = "Produto não encontrado."; return; }
  const p = snap.val();

  fotos = Array.isArray(p.fotosURLs) && p.fotosURLs.length ? p.fotosURLs : ["imagens/placeholder.jpg"];
  idx = 0;
  mostrarFoto();

  /* ----- preço e frete ----- */
  let precoHTML = "";
  if (p.oferta && p.precoAntigo && p.precoOferta) {
    precoHTML = `<p class="preco-ant">R$ ${Number(p.precoAntigo).toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>
                 <p class="preco-oferta">R$ ${Number(p.precoOferta).toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>`;
  } else {
    precoHTML = `<p class="preco">R$ ${Number(p.preco).toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>`;
  }
  const freteHTML = p.freteGratis ? `<p class="frete">🚚 Frete Grátis</p>` : "";

  /* ----- cores ----- */
  let coresHTML = "";
  if (Array.isArray(p.coresDetalhadas) && p.coresDetalhadas.length) {
    coresHTML = `<div class="cores-disponiveis" id="listaCores">
      ${p.coresDetalhadas.map((c,i)=>`
        <div class="cor-item" data-index="${i}" data-nome="${c.nome}">
          <div class="cor-bolinha" style="background:${c.cor||"#ccc"}"></div>
          <span class="cor-nome" style="display:none;">${c.nome}</span>
        </div>`).join("")}
    </div>`;
  }

  /* ----- descrição por categoria ----- */
  let descricaoHTML = "Detalhes não disponíveis.";
  if (p.categoria && formatadores[p.categoria]) {
    descricaoHTML = formatadores[p.categoria](p);
  }

  /* ----- inject HTML ----- */
  infoBox.innerHTML = `
    <p class="descricao">${descricaoHTML}</p>
    ${coresHTML}
    ${precoHTML}
    ${freteHTML}
    ${p.descricao ? `<p style="color:#555;font-style:italic;">${p.descricao}</p>` : ""}
  `;

  /* ----- evento de seleção de cor ----- */
  const corItens = document.querySelectorAll(".cor-item");
  corItens.forEach(item => {
    item.addEventListener("click", () => {
      corItens.forEach(i => {
        i.classList.remove("selecionada");
        i.querySelector(".cor-nome").style.display = "none";
      });
      item.classList.add("selecionada");
      const nomeCor = item.dataset.nome;
      item.querySelector(".cor-nome").style.display = "inline";
      corSelecionada = nomeCor;
      localStorage.setItem("vipandroid_corSelecionada", corSelecionada);
    });
  });

  // Atualiza meta tags após carregar o produto
  atualizarMetaTags(p);
}

/* -------- carrinho -------- */
addBtn.onclick = async () => {
  try {
    const snap = await get(ref(database, `produtos/${id}`));
    if (!snap.exists()) { mostrarNotificacao("Produto não encontrado no banco."); return; }
    const produto = snap.val();
    const estoqueDisponivel = produto.quantidade || 1;
    const carrinho = JSON.parse(localStorage.getItem("vipandroid_checkout")||"[]");
    const idxExistente = carrinho.findIndex(p=>p.id===id);
    const linkProduto = `${location.origin}/detalhes-produto.html?id=${id}`;

    if(corSelecionada){
      produto.corSelecionada = corSelecionada;
    }

    if(idxExistente>-1){
      const quantidadeAtual = carrinho[idxExistente].quantidade||1;
      if(quantidadeAtual>=estoqueDisponivel){ mostrarNotificacao("Você já adicionou todos os itens disponíveis em estoque."); return;}
      carrinho[idxExistente].quantidade++;
    } else {
      carrinho.push({...produto,id,quantidade:1,estoqueDisponivel,linkProduto});
    }

    localStorage.setItem("vipandroid_checkout",JSON.stringify(carrinho));
    atualizarCarrinhoFloat();
    mostrarNotificacao("Produto adicionado ao carrinho!");
    setTimeout(()=>window.location.href="carrinho.html",2000);
  } catch(err) {
    console.error(err);
    mostrarNotificacao("Erro ao adicionar produto ao carrinho.");
  }
};

/* -------- carrinho flutuante -------- */
function atualizarCarrinhoFloat(){
  const c = JSON.parse(localStorage.getItem("vipandroid_checkout")||"[]");
  cartFloat.classList.toggle("oculto",c.length===0);
}
window.addEventListener("storage", atualizarCarrinhoFloat);

/* -------- inicialização -------- */
atualizarCarrinhoFloat();
carregarProduto();