import { database } from './firebase-config.js';
import { ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const estoqueContainer = document.getElementById('estoqueContainer');
const buscaInput       = document.getElementById('busca');
const menuBotao        = document.getElementById('menuBotao');
const menuLateral      = document.getElementById('menuLateral');

// Modal de imagem
const modalImgCont    = document.getElementById("modalImagem");
const modalImg        = document.getElementById("modalImg");
const btnFecharImg    = modalImgCont.querySelector(".close");
const btnExcluirImg   = modalImgCont.querySelector(".delete");
const btnAddImg       = modalImgCont.querySelector(".add");
const btnEsq          = modalImgCont.querySelector(".arrow.left");
const btnDir          = modalImgCont.querySelector(".arrow.right");

// Modal de edição
const modalEdicao      = document.getElementById("modalEdicao");
const camposEdicao = {
  nome:             document.getElementById("editNome"),
  marca:            document.getElementById("editMarca"),
  armazenamento:    document.getElementById("editArmazenamento"),
  ram:              document.getElementById("editRam"),
  tela:             document.getElementById("editTela"),
  cameraTraseira:   document.getElementById("editCameraTraseira"),
  cameraFrontal:    document.getElementById("editCameraFrontal"),
  bateria:          document.getElementById("editBateria"),
  descricao:        document.getElementById("editDescricao"),
  preco:            document.getElementById("editPreco"),
  precoAntigo:      document.getElementById("editPrecoAntigo"),
  oferta:           document.getElementById("editOferta"),
  freteGratis:      document.getElementById("editFreteGratis"),
  quantidade:       document.getElementById("editQuantidade"),
};
const btnSalvarEdicao    = document.getElementById("btnSalvarEdicao");
const btnCancelarEdicao  = document.getElementById("btnCancelarEdicao");

let produtos = [];
let imagens = [];
let imgIndex = 0;
let produtoAtualId = null;

modalEdicao.classList.add('oculto');

menuBotao.addEventListener('click', () => {
  menuLateral.classList.toggle('visivel');
});

buscaInput.addEventListener('input', () => {
  const termo = buscaInput.value.toLowerCase();
  renderizarProdutos(produtos.filter(p => p.nome.toLowerCase().includes(termo)));
});

const produtosRef = ref(database, 'produtos');
onValue(produtosRef, snapshot => {
  const data = snapshot.val() || {};
  produtos = Object.entries(data).map(([id, p]) => ({ id, ...p }));
  renderizarProdutos(produtos);
});

function renderizarProdutos(lista) {
  estoqueContainer.innerHTML = '';
  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'produto-card'; // ← CORRIGIDO aqui

    const img = document.createElement('img');
    img.src = prod.fotosURLs?.[0] || 'imagens/semfoto.png';
    img.alt = prod.nome;
    img.addEventListener('click', () => abrirModalImagem(prod.id, prod.fotosURLs || []));

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `
      <h3>${prod.nome}</h3>
      <p>${prod.descricao || ''}</p>
      <p class="preco-oferta">R$ ${Number(prod.preco || 0).toFixed(2)}</p>
    `;

    if (prod.quantidade === 0) {
      info.innerHTML += `<p class="esgotado">❌ Esgotado</p>`;
    } else {
      info.innerHTML += `<p>📦 Estoque: ${prod.quantidade}</p>`;
    }

    const botoes = document.createElement('div');
    botoes.className = 'card-botoes';

    const btnEdit = document.createElement('button');
    btnEdit.className = 'btn-editar';
    btnEdit.textContent = 'Editar';
    btnEdit.addEventListener('click', () => abrirModalEdicao(prod));

    const btnDel = document.createElement('button');
    btnDel.className = 'btn-excluir';
    btnDel.textContent = 'Excluir';
    btnDel.addEventListener('click', () => excluirProduto(prod.id));

    botoes.append(btnEdit, btnDel);
    card.append(img, info, botoes);
    estoqueContainer.appendChild(card);
  });
}

function abrirModalEdicao(prod) {
  produtoAtualId = prod.id;
  Object.keys(camposEdicao).forEach(key => {
    const el = camposEdicao[key];
    if (el.tagName === 'SELECT') {
      el.value = prod[key] ? "true" : "false";
    } else {
      el.value = prod[key] ?? (key === 'quantidade' ? 0 : '');
    }
  });
  modalEdicao.classList.remove('oculto');
}

btnCancelarEdicao.addEventListener('click', () => {
  const confirmar = confirm("Cancelar edição? Todas as alterações serão perdidas.");
  if (confirmar) modalEdicao.classList.add('oculto');
});

btnSalvarEdicao.addEventListener('click', async () => {
  const confirmar = confirm("Deseja salvar as alterações?");
  if (!confirmar) return;

  const atualizacao = {
    nome:          camposEdicao.nome.value,
    marca:         camposEdicao.marca.value,
    armazenamento: camposEdicao.armazenamento.value,
    ram:           camposEdicao.ram.value,
    tela:          camposEdicao.tela.value,
    cameraTraseira:camposEdicao.cameraTraseira.value,
    cameraFrontal: camposEdicao.cameraFrontal.value,
    bateria:       camposEdicao.bateria.value,
    descricao:     camposEdicao.descricao.value,
    preco:         Number(camposEdicao.preco.value),
    precoAntigo:   Number(camposEdicao.precoAntigo.value),
    oferta:        camposEdicao.oferta.value === "true",
    freteGratis:   camposEdicao.freteGratis.value === "true",
    quantidade:    Number(camposEdicao.quantidade.value)
  };
  await update(ref(database, `produtos/${produtoAtualId}`), atualizacao);
  modalEdicao.classList.add('oculto');
});

function abrirModalImagem(id, listaFotos) {
  produtoAtualId = id;
  imagens = [...listaFotos];
  imgIndex = 0;
  atualizarImgModal();
  modalImgCont.classList.add('active');
}

function atualizarImgModal() {
  if (!imagens.length) {
    modalImg.src = 'imagens/semfoto.png';
    return;
  }
  modalImg.src = imagens[imgIndex];
}

btnEsq.addEventListener('click', () => {
  imgIndex = (imgIndex - 1 + imagens.length) % imagens.length;
  atualizarImgModal();
});
btnDir.addEventListener('click', () => {
  imgIndex = (imgIndex + 1) % imagens.length;
  atualizarImgModal();
});
btnFecharImg.addEventListener('click', () => modalImgCont.classList.remove('active'));

btnExcluirImg.addEventListener('click', () => {
  const confirmar = confirm("Tem certeza que deseja excluir esta imagem?");
  if (!confirmar) return;

  imagens.splice(imgIndex, 1);
  update(ref(database, `produtos/${produtoAtualId}`), { fotosURLs: imagens });
  if (imgIndex >= imagens.length) imgIndex = imagens.length - 1;
  atualizarImgModal();
});

btnAddImg.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'preset_publico');
    formData.append('folder', 'vip-android');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dpfdb5ufw/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      const url = data.secure_url;
      if (url) {
        imagens.push(url);
        await update(ref(database, `produtos/${produtoAtualId}`), { fotosURLs: imagens });
        imgIndex = imagens.length - 1;
        atualizarImgModal();
      }
    } catch (err) {
      alert("Erro ao enviar imagem. Tente novamente.");
      console.error(err);
    }
  };

  input.click();
});

async function excluirProduto(id) {
  if (!confirm("Deseja excluir este produto?")) return;
  await remove(ref(database, `produtos/${id}`));
}
