/* js/cadastro-produto.js */
import { database } from "./firebase-config.js";
import { ref as dbRef, push, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

/* ─── Cloudinary ─── */
const CLOUD_NAME   = "dpfdb5ufw";
const UPLOAD_PRESET = "preset_publico";

/* ─── DOM ─── */
const form            = document.getElementById("formCadastro");
const msgEl           = document.getElementById("mensagem");
const fotosInput      = document.getElementById("fotos");
const fotosLista      = document.getElementById("fotosLista");
const ofertaDiaBox    = document.getElementById("ofertaDia");
const ofertaBox       = document.getElementById("ofertaBox");
const precoInput      = document.getElementById("preco");
const precoOfertaI    = document.getElementById("precoOferta");
const coresSelLabel   = document.getElementById("coresSelecionadas");
const coresOpcoesWrap = document.getElementById("coresOpcoes");

/* ─── cores padrão ─── */
const CORES_PADRAO = [
  { nome:"Preto",    cor:"#000000" },
  { nome:"Branco",   cor:"#ffffff" },
  { nome:"Azul",     cor:"#0000ff" },
  { nome:"Vermelho", cor:"#ff0000" },
  { nome:"Verde",    cor:"#008000" },
  { nome:"Rosa",     cor:"#ffc0cb" },
  { nome:"Dourado",  cor:"#ffd700" },
  { nome:"Prata",    cor:"#c0c0c0" },
  { nome:"Bege",     cor:"#f5f5dc" }
];

/* ─── render das opções de cor ─── */
CORES_PADRAO.forEach(c => {
  const label  = document.createElement("label");
  label.className = "cor-opcao";

  const cbx    = document.createElement("input");
  cbx.type     = "checkbox";
  cbx.value    = c.nome;
  cbx.dataset.corHex = c.cor;
  cbx.addEventListener("change", atualizarCoresSelecionadas);

  const bolinha = document.createElement("div");
  bolinha.className = "cor-bolinha";
  bolinha.style.background = c.cor;

  label.append(cbx, bolinha, document.createTextNode(c.nome));
  coresOpcoesWrap.appendChild(label);
});

function atualizarCoresSelecionadas() {
  const sel = [...document.querySelectorAll(".cor-opcao input:checked")].map(el => el.value);
  coresSelLabel.textContent = sel.length
    ? "Cores selecionadas: " + sel.join(", ")
    : "Nenhuma cor selecionada";
}

/* ─── sincronizar preço‑oferta → preço normal ─── */
ofertaDiaBox.addEventListener("change", () => {
  const ativo = ofertaDiaBox.checked;
  ofertaBox.style.display = ativo ? "block" : "none";
  precoOfertaI.value = "";
  precoInput.value   = "";
});
precoOfertaI.addEventListener("input", () => {
  if (ofertaDiaBox.checked) precoInput.value = precoOfertaI.value;
});

/* ─── mostrar lista de arquivos escolhidos ─── */
fotosInput.addEventListener("change", () => {
  fotosLista.innerHTML = "";
  const arquivos = fotosInput.files;
  if (arquivos.length === 0) return;
  for (const file of arquivos) {
    const li = document.createElement("li");
    li.textContent = file.name;
    fotosLista.appendChild(li);
  }
});

/* ─── helper de mensagens ─── */
const showMsg = (txt, erro = true) => {
  msgEl.textContent = txt;
  msgEl.style.color = erro ? "#ff7575" : "#00ff99";
};

/* ─── upload múltiplo para Cloudinary ─── */
async function uploadFotos(files) {
  const urls = [];
  for (const file of files) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: fd
    });
    if (!r.ok) throw new Error("Falha no upload");
    const j = await r.json();
    urls.push(j.secure_url);
  }
  return urls;
}

/* ─── submit ─── */
form.addEventListener("submit", async e => {
  e.preventDefault();
  showMsg("Validando dados...", false);

  const nome   = form.nome.value.trim();
  const marca  = form.marca.value.trim();
  const estado = form.estado.value;
  const preco  = Number(precoInput.value);
  const qtd    = Number(form.quantidade.value);
  const status = form.status.value;

  if (!nome || !marca || !estado || !preco || isNaN(qtd) || !status || fotosInput.files.length === 0) {
    showMsg("Preencha todos os campos obrigatórios.");
    return;
  }

  const memoria = form.memoria.value.trim();
  const arm     = form.armazenamento.value.trim();
  const tela    = form.tela.value.trim();
  const bateria = form.bateria.value.trim();
  const camT    = form.cameraTraseira.value.trim();
  const camF    = form.cameraFrontal.value.trim();
  const desc    = form.descricao.value.trim();

  const coresDetalhadas = [...document.querySelectorAll(".cor-opcao input:checked")]
    .map(el => ({ nome: el.value, cor: el.dataset.corHex }));

  const oferta      = ofertaDiaBox.checked;
  const precoAntigo = Number(form.precoAntigo.value) || null;
  const precoOferta = Number(precoOfertaI.value)     || null;
  if (oferta && (!precoAntigo || !precoOferta)) {
    showMsg("Informe preço antigo e preço oferta.");
    return;
  }

  const freteGratis = document.getElementById("freteGratis").checked;

  try {
    showMsg("Enviando fotos...", false);
    const fotosURLs = await uploadFotos(fotosInput.files);

    showMsg("Salvando produto...", false);

    const produto = {
      nome, marca, estado, preco, quantidade: qtd, status,
      memoria, armazenamento: arm, tela, bateria,
      cameraTraseira: camT, cameraFrontal: camF,
      coresDetalhadas,
      descricao: desc,
      oferta,
      precoAntigo: oferta ? precoAntigo : null,
      precoOferta: oferta ? precoOferta : null,
      freteGratis,
      fotosURLs,
      dataCadastro: new Date().toISOString()
    };

    await set(push(dbRef(database, "produtos")), produto);

    showMsg("Produto cadastrado com sucesso!", false);
    form.reset();
    fotosLista.innerHTML = "";
    atualizarCoresSelecionadas();
    ofertaBox.style.display = "none";
  } catch (err) {
    console.error(err);
    showMsg("Erro ao cadastrar produto.");
  }
});
