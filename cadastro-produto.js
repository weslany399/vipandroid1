/* js/cadastro-produto.js */
import { database } from "./firebase-config.js";
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ─── Cloudinary ─── */
const CLOUD_NAME   = "dpfdb5ufw";
const UPLOAD_PRESET = "preset_publico";

/* ─── DOM ─── */
const form        = document.getElementById("formCadastro");
const msgEl       = document.getElementById("mensagem");
const categoria   = document.getElementById("categoria");
const nomeInput   = document.getElementById("nome");
const marcaInput  = document.getElementById("marca");
const precoInput  = document.getElementById("preco");
const qtdInput    = document.getElementById("quantidade");
const coresWrap   = document.getElementById("coresOpcoes");
const coresLabel  = document.getElementById("coresSelecionadas");
const midiasInput = document.getElementById("midias");
const midiasLista = document.getElementById("midiasLista");
const opcionaisDiv= document.querySelectorAll(".categoria-bloco");
const ofertaDia   = document.getElementById("ofertaDia");
const precoOferta = document.getElementById("precoOferta");
const ofertaBox   = document.getElementById("ofertaBox");

/* 🔹 Campo estado (apenas para celulares) */
const estadoInput = document.getElementById("estado");

/* ─── Exemplos por categoria ─── */
const EXEMPLOS = {
  celular: { nome: "Galaxy S25", marca: "Samsung", preco: "2999.00", quantidade: "2" },
  notebook: { nome: "MacBook Pro 16", marca: "Apple", preco: "14999.00", quantidade: "1" },
  tablet: { nome: "iPad Pro 12.9", marca: "Apple", preco: "7999.00", quantidade: "2" },
  fone: { nome: "AirPods Pro 2", marca: "Apple", preco: "1999.00", quantidade: "4" },
  caixaSom: { nome: "JBL PartyBox 310", marca: "JBL", preco: "1899.00", quantidade: "5" },
  teclado: { nome: "G213 Prodigy", marca: "Logitech", preco: "399.00", quantidade: "12" },
  mouse: { nome: "DeathAdder V2", marca: "Razer", preco: "499.00", quantidade: "10" },
  controle: { nome: "DualSense", marca: "Sony", preco: "549.00", quantidade: "12" },
  capinha: { nome: "Capinha iPhone 15", marca: "Apple", preco: "99.00", quantidade: "50" },
  pelicula: { nome: "Película iPhone 15", marca: "3M", preco: "49.00", quantidade: "40" },
  carregador: { nome: "Carregador PD 20W", marca: "Xiaomi", preco: "79.00", quantidade: "30" },
  pendrive: { nome: "SSD 1TB", marca: "Kingston", preco: "599.00", quantidade: "10" },
  fonteCabo: { nome: "Cabo USB-C 1m", marca: "Anker", preco: "59.00", quantidade: "40" },
  monitor: { nome: "Monitor 24\" FHD", marca: "Samsung", preco: "999.00", quantidade: "6" },
  cartaoMemoria: { nome: "Cartão 128GB", marca: "SanDisk", preco: "149.00", quantidade: "20" },
  microfone: { nome: "BM800", marca: "Behringer", preco: "299.00", quantidade: "10" },
  ringlight: { nome: "Ring Light 18\"", marca: "Neewer", preco: "199.00", quantidade: "12" },
  tripe: { nome: "Tripé 100cm", marca: "Generic", preco: "129.00", quantidade: "15" },
  outros: { nome: "Acessório XYZ", marca: "MarcaX", preco: "59.00", quantidade: "25" }
};

/* ─── Cores padrão ─── */
const CORES_PADRAO = [
  { nome:"Preto", cor:"#000000" },
  { nome:"Marrom", cor:"#773b03ff" },
  { nome:"Lilas", cor:"#812971ff" },
  { nome:"Cinza", cor:"#3c4431ff" },
  { nome:"Laranja", cor:"#ff9900ff" },
  { nome:"Amarelo", cor:"#eaff00ff" },
  { nome:"Branco", cor:"#ffffff" },
  { nome:"Azul", cor:"#0000ff" },
  { nome:"Vermelho", cor:"#ff0000" },
  { nome:"Verde", cor:"#008000" },
  { nome:"Rosa", cor:"#ffc0cb" },
  { nome:"Dourado", cor:"#ffd900ce" },
  { nome:"Prata", cor:"#c0c0c0" },
  { nome:"Bege", cor:"#f5f5dc" },
  { nome:"Azul Oceano", cor:"#0077be" },
  { nome:"Azul Bebê", cor:"#89cff0" },
  { nome:"Rosa Claro", cor:"#ffb6c1" },
  { nome:"Rosa Escuro", cor:"#c71585" },
  { nome:"Amarelo Ouro", cor:"#ffd700" },
  { nome:"Laranja Escuro", cor:"#ff8c00" },
  { nome:"Azul Turquesa", cor:"#40e0d0" },
  { nome:"Verde Menta", cor:"#98ff98" },
  { nome:"Roxo Escuro", cor:"#4b0082" },
  { nome:"Marrom Claro", cor:"#a52a2a" },
  { nome:"Verde Claro", cor:"#90ee90" },
  { nome:"Verde Escuro", cor:"#006400" },
  { nome:"Azul Claro", cor:"#add8e6" },
  { nome:"Azul Escuro", cor:"#00008b" },
  { nome:"Roxa", cor:"#800080" },
  { nome:"Vermelho + Prata", cor:"linear-gradient(45deg, #ff0000, #c0c0c0)" },
  { nome:"Vermelho + Preto", cor:"linear-gradient(45deg, #ff0000, #000000)" },
  { nome:"Preto + Prata", cor:"linear-gradient(45deg, #000000, #c0c0c0)" },
  { nome:"Preto + Branco", cor:"linear-gradient(45deg, #000000, #ffffff)" },
  { nome:"Verde + Prata", cor:"linear-gradient(45deg, #008000, #c0c0c0)" },
  { nome:"Vermelho + Branco", cor:"linear-gradient(45deg, #ff0000, #ffffff)" },
  { nome:"Verde + Branco", cor:"linear-gradient(45deg, #008000, #ffffff)" },
  { nome:"Verde + Preto", cor:"linear-gradient(45deg, #008000, #000000)" },
  { nome:"Transparente", cor:"transparent" },
];

/* ─── Render cores ─── */
CORES_PADRAO.forEach(c => {
  const label = document.createElement("label");
  label.className = "cor-opcao";

  const cbx = document.createElement("input");
  cbx.type = "checkbox";
  cbx.value = c.nome;
  cbx.dataset.corHex = c.cor;
  cbx.addEventListener("change", atualizarCoresSelecionadas);

  const bolinha = document.createElement("div");
  bolinha.className = "cor-bolinha";
  bolinha.style.background = c.cor;

  label.append(cbx, bolinha, document.createTextNode(c.nome));
  coresWrap.appendChild(label);
});

function atualizarCoresSelecionadas() {
  const sel = [...document.querySelectorAll(".cor-opcao input:checked")].map(el => el.value);
  coresLabel.textContent = sel.length ? "Cores selecionadas: " + sel.join(", ") : "Nenhuma cor selecionada";
}

/* ─── Mostrar bloco da categoria + placeholders ─── */
categoria.addEventListener("change", () => {
  msgEl.textContent = "";
  const cat = categoria.value;

  opcionaisDiv.forEach(div => div.style.display = div.dataset.cat === cat ? "block" : "none");

  // estado só aparece em celular
  if (cat === "celular") {
    estadoInput.parentElement.style.display = "block";
  } else {
    estadoInput.parentElement.style.display = "none";
    estadoInput.value = "";
  }

  if (EXEMPLOS[cat]) {
    nomeInput.placeholder   = `Ex: ${EXEMPLOS[cat].nome}`;
    marcaInput.placeholder  = `Ex: ${EXEMPLOS[cat].marca}`;
    precoInput.placeholder  = `Ex: ${EXEMPLOS[cat].preco}`;
    qtdInput.placeholder    = `Ex: ${EXEMPLOS[cat].quantidade}`;
  } else {
    nomeInput.placeholder = marcaInput.placeholder = precoInput.placeholder = qtdInput.placeholder = "Ex: preencha o campo";
  }
});

/* ─── Upload múltiplo Cloudinary ─── */
async function uploadMidias(files) {
  const urls = [];
  for (const file of files) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: fd });
    if (!r.ok) throw new Error("Falha no upload");
    const j = await r.json();
    urls.push(j.secure_url);
  }
  return urls;
}

/* ─── Mostrar arquivos escolhidos ─── */
midiasInput.addEventListener("change", () => {
  midiasLista.innerHTML = "";
  const ul = document.createElement("ul");
  for (const file of midiasInput.files) {
    const li = document.createElement("li");
    li.textContent = file.name;
    ul.appendChild(li);
  }
  midiasLista.appendChild(ul);
});

/* ─── Mensagem helper ─── */
function showMsg(txt, erro = true) {
  msgEl.textContent = txt;
  msgEl.style.color = erro ? "#ff7575" : "#00ff99";
}

/* ─── Oferta do dia ─── */
ofertaDia.addEventListener("change", () => {
  ofertaBox.style.display = ofertaDia.checked ? "block" : "none";
});

/* ─── Submit do form ─── */
form.addEventListener("submit", async e => {
  e.preventDefault();
  showMsg("Validando...", false);

  const cat = categoria.value;
  if (!cat) { showMsg("Selecione a categoria."); return; }

  if (!nomeInput.value.trim() || !marcaInput.value.trim() || !precoInput.value || !qtdInput.value) {
    showMsg("Preencha todos os campos obrigatórios.");
    return;
  }

  // 🔹 Valida estado apenas se for celular
  if (cat === "celular" && !estadoInput.value.trim()) {
    showMsg("Selecione o estado do celular.");
    return;
  }

  if (midiasInput.files.length === 0) {
    showMsg("Adicione pelo menos uma foto/vídeo.");
    return;
  }

  const coresSel = [...document.querySelectorAll(".cor-opcao input:checked")].map(el => ({
    nome: el.value,
    cor: el.dataset.corHex
  }));

  if (coresSel.length === 0) { showMsg("Selecione pelo menos uma cor."); return; }

  try {
    showMsg("Enviando mídias...", false);
    const fotosURLs = await uploadMidias(midiasInput.files);

    const produto = {
      categoria: cat,
      nome: nomeInput.value.trim(),
      marca: marcaInput.value.trim(),
      preco: Number(precoInput.value),
      quantidade: Number(qtdInput.value),
      coresDetalhadas: coresSel, // 🔹 ajustado aqui
      fotosURLs, 
      oferta: ofertaDia.checked ? Number(precoOferta.value) : null,
      dataCadastro: new Date().toISOString()
    };

    // adiciona opcionais da categoria
    const opcionaisCampos = document.querySelectorAll(`.categoria-bloco[data-cat="${cat}"] input, .categoria-bloco[data-cat="${cat}"] textarea`);
    opcionaisCampos.forEach(input => {
      if (input.id) produto[input.id] = input.value.trim();
    });

    // 🔹 adiciona estado somente se for celular
    if (cat === "celular") {
      produto.estado = estadoInput.value.trim();
    }

    await set(push(dbRef(database, "produtos")), produto);

    showMsg("Produto cadastrado com sucesso!", false);
    form.reset();
    midiasLista.innerHTML = "";
    atualizarCoresSelecionadas();
    opcionaisDiv.forEach(div => div.style.display = "none");
    ofertaBox.style.display = "none";
    estadoInput.parentElement.style.display = "none";

  } catch (err) {
    console.error(err);
    showMsg("Erro ao cadastrar produto.");
  }
});
