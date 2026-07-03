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
const modalEdicao         = document.getElementById("modalEdicao");
const categoriaInfo       = document.getElementById("categoriaInfo");
const camposEspecificos   = document.getElementById("camposEspecificos");
const btnSalvarEdicao     = document.getElementById("btnSalvarEdicao");
const btnCancelarEdicao   = document.getElementById("btnCancelarEdicao");

let produtos = [];
let imagens = [];
let imgIndex = 0;
let produtoAtualId = null;
let categoriaAtual = null;

modalEdicao.classList.add('oculto');

// Mapeamento de campos por categoria
const camposPorCategoria = {
  celular: [
    { id: 'armazenamento', label: 'Armazenamento', type: 'text', placeholder: 'Ex: 256GB' },
    { id: 'memoria', label: 'RAM', type: 'text', placeholder: 'Ex: 8GB' },
    { id: 'tela', label: 'Tela', type: 'text', placeholder: 'Ex: 6.8" AMOLED' },
    { id: 'bateria', label: 'Bateria', type: 'text', placeholder: 'Ex: 5000mAh' },
    { id: 'cameraTraseira', label: 'Câmera Traseira', type: 'text', placeholder: 'Ex: 50+12+10MP' },
    { id: 'cameraFrontal', label: 'Câmera Frontal', type: 'text', placeholder: 'Ex: 12MP' },
    { id: 'sistemaOperacional', label: 'Sistema Operacional', type: 'text', placeholder: 'Ex: Android 14' },
    { id: 'modeloCPU', label: 'Modelo da CPU', type: 'text', placeholder: 'Ex: Snapdragon 8 Gen 3' },
    { id: 'velocidadeCPU', label: 'Velocidade CPU', type: 'text', placeholder: 'Ex: 3.2GHz' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  notebook: [
    { id: 'nb-cpu', label: 'Processador', type: 'text', placeholder: 'Ex: Intel Core i7 13ª geração' },
    { id: 'nb-ram', label: 'Memória RAM (GB)', type: 'number', placeholder: 'Ex: 16' },
    { id: 'nb-storage', label: 'Armazenamento', type: 'text', placeholder: 'Ex: SSD 512GB NVMe' },
    { id: 'nb-gpu', label: 'Placa de vídeo', type: 'text', placeholder: 'Ex: RTX 3050 4GB' },
    { id: 'nb-tela', label: 'Tela', type: 'text', placeholder: 'Ex: 15.6" Full HD IPS' },
    { id: 'nb-teclado', label: 'Teclado', type: 'text', placeholder: 'Ex: Retroiluminado' },
    { id: 'nb-conex', label: 'Conexões', type: 'text', placeholder: 'Ex: 3x USB, HDMI, Wi-Fi 6' },
    { id: 'nb-audio', label: 'Áudio', type: 'text', placeholder: 'Ex: Dolby Atmos' },
    { id: 'nb-bateria', label: 'Bateria', type: 'text', placeholder: 'Ex: Até 10-12h' },
    { id: 'nb-camera', label: 'Câmera', type: 'text', placeholder: 'Ex: 720p HD' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  tablet: [
    { id: 'tab-tela', label: 'Tela', type: 'text', placeholder: 'Ex: 10.5" TFT 1920x1200' },
    { id: 'tab-cpu', label: 'Processador', type: 'text', placeholder: 'Ex: Octa-Core 2.0 GHz' },
    { id: 'tab-ram', label: 'RAM', type: 'text', placeholder: 'Ex: 4GB' },
    { id: 'tab-storage', label: 'Armazenamento', type: 'text', placeholder: 'Ex: 64GB (expansível)' },
    { id: 'tab-bateria', label: 'Bateria', type: 'text', placeholder: 'Ex: 7040mAh – até 12h' },
    { id: 'tab-conec', label: 'Conectividade', type: 'text', placeholder: 'Ex: Wi-Fi, 4G LTE, BT 5.0' },
    { id: 'tab-cameraT', label: 'Câmera Traseira', type: 'text', placeholder: 'Ex: 16MP' },
    { id: 'tab-cameraF', label: 'Câmera Frontal', type: 'text', placeholder: 'Ex: 8MP' },
    { id: 'tab-acess', label: 'Acessórios inclusos', type: 'text', placeholder: 'Ex: Carregador, Cabo USB-C' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  fone: [
    { id: 'fone-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Over-ear / In-ear / TWS' },
    { id: 'fone-conec', label: 'Conectividade', type: 'text', placeholder: 'Ex: Bluetooth 5.0 / P2' },
    { id: 'fone-audio', label: 'Qualidade de áudio', type: 'text', placeholder: 'Ex: Som Pure Bass JBL' },
    { id: 'fone-mic', label: 'Microfone', type: 'text', placeholder: 'Ex: Cancelamento de ruído' },
    { id: 'fone-batt', label: 'Bateria', type: 'text', placeholder: 'Ex: Até 40h' },
    { id: 'fone-peso', label: 'Peso', type: 'text', placeholder: 'Ex: 160g' },
    { id: 'fone-itens', label: 'Itens inclusos', type: 'text', placeholder: 'Ex: Cabo USB-C, manual' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  caixaSom: [
    { id: 'som-modelo', label: 'Modelo', type: 'text', placeholder: 'Ex: X200 PartyBox' },
    { id: 'som-pot', label: 'Potência (W)', type: 'text', placeholder: 'Ex: 20W' },
    { id: 'som-tipo', label: 'Tipo de som', type: 'text', placeholder: 'Ex: Estéreo / Mono' },
    { id: 'som-batt', label: 'Bateria', type: 'text', placeholder: 'Ex: 5000mAh – até 12h' },
    { id: 'som-conec', label: 'Conectividade', type: 'text', placeholder: 'Ex: Bluetooth, USB, P2' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Ex: IPX7, LED, rádio FM...' }
  ],
  teclado: [
    { id: 'tecl-modelo', label: 'Modelo', type: 'text', placeholder: 'Ex: G213 / K120' },
    { id: 'tecl-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Mecânico / Membrana' },
    { id: 'tecl-layout', label: 'Layout', type: 'text', placeholder: 'Ex: ABNT2 / US Intl' },
    { id: 'tecl-back', label: 'Backlight / Iluminação', type: 'text', placeholder: 'Ex: RGB' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  mouse: [
    { id: 'mouse-modelo', label: 'Modelo', type: 'text', placeholder: 'Ex: DeathAdder / M100' },
    { id: 'mouse-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Óptico / Laser / Wireless' },
    { id: 'mouse-dpi', label: 'DPI / Resolução', type: 'text', placeholder: 'Ex: 800 / 1600 / 2400' },
    { id: 'mouse-botoes', label: 'Nº de botões', type: 'text', placeholder: 'Ex: 6' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  controle: [
    { id: 'ctl-modelo', label: 'Modelo', type: 'text', placeholder: 'Ex: DualShock 4 / Xbox Series' },
    { id: 'ctl-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Wireless / Com fio' },
    { id: 'ctl-compat', label: 'Compatibilidade', type: 'text', placeholder: 'Ex: PS4 / Xbox / PC / Android' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  capinha: [
    { id: 'cap-compat', label: 'Modelo compatível', type: 'text', placeholder: 'Ex: iPhone 14 / Galaxy S25' },
    { id: 'cap-material', label: 'Material', type: 'text', placeholder: 'Ex: Silicone / TPU / Couro' },
    { id: 'cap-recursos', label: 'Recursos', type: 'text', placeholder: 'Ex: Anti-impacto / Kickstand' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  pelicula: [
    { id: 'pel-modelo', label: 'Modelo compatível', type: 'text', placeholder: 'Ex: iPhone 14 / Galaxy S25' },
    { id: 'pel-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Vidro temperado 0.33mm 9H' },
    { id: 'pel-recursos', label: 'Recursos', type: 'text', placeholder: 'Ex: Oleofóbica / Anti-reflexo' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  carregador: [
    { id: 'chg-modelo', label: 'Modelo', type: 'text', placeholder: 'Ex: EP-TA20 / MD813LL/A' },
    { id: 'chg-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: USB-C / Lightning / Wireless' },
    { id: 'chg-pot', label: 'Potência', type: 'text', placeholder: 'Ex: 20W / 30W' },
    { id: 'chg-comp', label: 'Compatibilidade', type: 'text', placeholder: 'Ex: iPhone / Samsung / Xiaomi' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  armazenamento: [
    { id: 'arm-cap', label: 'Capacidade', type: 'text', placeholder: 'Ex: 128GB / 1TB' },
    { id: 'arm-interface', label: 'Interface', type: 'text', placeholder: 'Ex: USB 3.0 / NVMe' },
    { id: 'arm-vel', label: 'Velocidade leitura/gravação', type: 'text', placeholder: 'Ex: até 130 MB/s' },
    { id: 'arm-seg', label: 'Segurança', type: 'text', placeholder: 'Ex: Encriptação' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  fonteCabo: [
    { id: 'fc-entrada', label: 'Entrada', type: 'text', placeholder: 'Ex: 100-240V ~ 50/60Hz' },
    { id: 'fc-saida', label: 'Saída / Potência', type: 'text', placeholder: 'Ex: 19.5V 3.34A (65W)' },
    { id: 'fc-conector', label: 'Conector', type: 'text', placeholder: 'Ex: Pino fino / USB-C PD' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  monitor: [
    { id: 'mon-tam', label: 'Tamanho tela', type: 'text', placeholder: 'Ex: 24"' },
    { id: 'mon-res', label: 'Resolução', type: 'text', placeholder: 'Ex: Full HD / 4K' },
    { id: 'mon-refresh', label: 'Taxa de atualização', type: 'text', placeholder: 'Ex: 60Hz / 144Hz' },
    { id: 'mon-painel', label: 'Tipo de painel', type: 'text', placeholder: 'Ex: IPS / VA / TN' },
    { id: 'mon-rec', label: 'Recursos', type: 'text', placeholder: 'Ex: Ajuste de altura, VESA' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  cartaoMemoria: [
    { id: 'cm-cap', label: 'Capacidade', type: 'text', placeholder: 'Ex: 64GB / 128GB' },
    { id: 'cm-vel', label: 'Classe / Velocidade', type: 'text', placeholder: 'Ex: Class 10 / UHS-I' },
    { id: 'cm-comp', label: 'Compatibilidade', type: 'text', placeholder: 'Ex: Android, câmeras, GoPro' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  microfone: [
    { id: 'mic-model', label: 'Modelo', type: 'text', placeholder: 'Ex: BM800 / MV7' },
    { id: 'mic-tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Condensador / Dinâmico / USB' },
    { id: 'mic-conec', label: 'Conectividade', type: 'text', placeholder: 'Ex: USB / XLR / P2 / Bluetooth' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  ringlight: [
    { id: 'rl-tam', label: 'Diâmetro / Tamanho', type: 'text', placeholder: 'Ex: 10", 18"' },
    { id: 'rl-temp', label: 'Temperatura de cor', type: 'text', placeholder: 'Ex: Quente / Neutra / Fria' },
    { id: 'rl-acess', label: 'Acessórios inclusos', type: 'text', placeholder: 'Ex: Tripé, controle remoto' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  tripe: [
    { id: 'trp-alt', label: 'Altura máxima/min', type: 'text', placeholder: 'Ex: 35cm a 100cm' },
    { id: 'trp-material', label: 'Material', type: 'text', placeholder: 'Ex: Alumínio' },
    { id: 'trp-comp', label: 'Compatibilidade', type: 'text', placeholder: 'Ex: Smartphones até 85mm' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ],
  outros: [
    { id: 'out-modelo', label: 'Modelo / Código', type: 'text', placeholder: 'Ex: ABC-123' },
    { id: 'out-cat', label: 'Categoria', type: 'text', placeholder: 'Ex: Acessório' },
    { id: 'out-espec', label: 'Especificações técnicas', type: 'textarea', placeholder: 'Dimensões, material...' },
    { id: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Detalhes adicionais...' }
  ]
};

const nomesCategorias = {
  celular: 'Celular',
  notebook: 'Notebook',
  tablet: 'Tablet',
  fone: 'Fone de ouvido',
  caixaSom: 'Caixa de som',
  teclado: 'Teclado',
  mouse: 'Mouse',
  controle: 'Controle de videogame',
  capinha: 'Capinha / Capa',
  pelicula: 'Película',
  carregador: 'Carregador',
  armazenamento: 'Pen drive / HD / SSD',
  fonteCabo: 'Fontes e Cabos de Energia',
  monitor: 'Monitores e Suportes',
  cartaoMemoria: 'Cartão de memória',
  microfone: 'Microfone',
  ringlight: 'Ring Light',
  tripe: 'Tripé',
  outros: 'Outros'
};

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
    card.className = 'produto-card';

    const img = document.createElement('img');
    img.src = prod.fotosURLs?.[0] || 'imagens/semfoto.png';
    img.alt = prod.nome;
    img.addEventListener('click', () => abrirModalImagem(prod.id, prod.fotosURLs || []));

    const info = document.createElement('div');
    info.className = 'card-info';
    
    const catNome = nomesCategorias[prod.categoria] || prod.categoria || 'Produto';
    
    info.innerHTML = `
      <h3>${prod.nome}</h3>
      <p><strong>Categoria:</strong> ${catNome}</p>
      <p><strong>Marca:</strong> ${prod.marca || '-'}</p>
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
  categoriaAtual = prod.categoria || 'outros';
  
  // Atualiza título com categoria
  const catNome = nomesCategorias[categoriaAtual] || categoriaAtual;
  categoriaInfo.textContent = `Categoria: ${catNome}`;
  
  // Preenche campos comuns
  document.getElementById('editNome').value = prod.nome || '';
  document.getElementById('editMarca').value = prod.marca || '';
  document.getElementById('editPreco').value = prod.preco || '';
  document.getElementById('editQuantidade').value = prod.quantidade || 0;
  document.getElementById('editEstado').value = prod.estado || '';
  document.getElementById('editStatus').value = prod.status || 'disponivel';
  document.getElementById('editOferta').value = prod.oferta ? 'true' : 'false';
  document.getElementById('editPrecoAntigo').value = prod.precoAntigo || '';
  document.getElementById('editPrecoOferta').value = prod.precoOferta || '';
  
  // Gera campos específicos da categoria
  gerarCamposEspecificos(categoriaAtual, prod);
  
  modalEdicao.classList.remove('oculto');
}

function gerarCamposEspecificos(categoria, prod) {
  camposEspecificos.innerHTML = '';
  
  const campos = camposPorCategoria[categoria] || [];
  
  if (campos.length === 0) {
    camposEspecificos.innerHTML = '<p style="text-align:center;color:#999;">Nenhum campo específico para esta categoria.</p>';
    return;
  }
  
  const secao = document.createElement('div');
  secao.className = 'secao-campos';
  
  const titulo = document.createElement('h3');
  titulo.textContent = `Campos Específicos - ${nomesCategorias[categoria] || categoria}`;
  secao.appendChild(titulo);
  
  const linha = document.createElement('div');
  linha.className = 'campos-edicao-linha';
  
  // Divide em duas colunas
  const coluna1 = document.createElement('div');
  const coluna2 = document.createElement('div');
  
  campos.forEach((campo, index) => {
    const label = document.createElement('label');
    label.textContent = campo.label + ':';
    
    let input;
    if (campo.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = campo.type;
    }
    
    input.id = `edit-${campo.id}`;
    input.placeholder = campo.placeholder || '';
    input.value = prod[campo.id] || '';
    
    label.appendChild(input);
    
    // Alterna entre colunas
    if (index % 2 === 0) {
      coluna1.appendChild(label);
    } else {
      coluna2.appendChild(label);
    }
  });
  
  linha.appendChild(coluna1);
  linha.appendChild(coluna2);
  secao.appendChild(linha);
  camposEspecificos.appendChild(secao);
}

btnCancelarEdicao.addEventListener('click', () => {
  const confirmar = confirm("Cancelar edição? Todas as alterações serão perdidas.");
  if (confirmar) modalEdicao.classList.add('oculto');
});

btnSalvarEdicao.addEventListener('click', async () => {
  const confirmar = confirm("Deseja salvar as alterações?");
  if (!confirmar) return;

  // Coleta campos comuns
  const atualizacao = {
    nome: document.getElementById('editNome').value,
    marca: document.getElementById('editMarca').value,
    preco: Number(document.getElementById('editPreco').value),
    quantidade: Number(document.getElementById('editQuantidade').value),
    estado: document.getElementById('editEstado').value,
    status: document.getElementById('editStatus').value,
    oferta: document.getElementById('editOferta').value === 'true',
    precoAntigo: Number(document.getElementById('editPrecoAntigo').value) || null,
    precoOferta: Number(document.getElementById('editPrecoOferta').value) || null,
    categoria: categoriaAtual
  };

  // Coleta campos específicos da categoria
  const campos = camposPorCategoria[categoriaAtual] || [];
  campos.forEach(campo => {
    const input = document.getElementById(`edit-${campo.id}`);
    if (input) {
      atualizacao[campo.id] = input.value || '';
    }
  });

  try {
    await update(ref(database, `produtos/${produtoAtualId}`), atualizacao);
    alert('Produto atualizado com sucesso!');
    modalEdicao.classList.add('oculto');
    
    // Atualiza lista local
    produtos = produtos.map(p => p.id === produtoAtualId ? { ...p, ...atualizacao } : p);
    renderizarProdutos(produtos);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    alert('Erro ao salvar. Tente novamente.');
  }
});

// ========== MODAL DE IMAGENS ==========
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

btnExcluirImg.addEventListener('click', async () => {
  const confirmar = confirm("Tem certeza que deseja excluir esta imagem?");
  if (!confirmar) return;

  imagens.splice(imgIndex, 1);
  await update(ref(database, `produtos/${produtoAtualId}`), { fotosURLs: imagens });
  
  if (imgIndex >= imagens.length) imgIndex = imagens.length - 1;
  atualizarImgModal();
  
  // Atualiza na lista
  produtos = produtos.map(p => p.id === produtoAtualId ? { ...p, fotosURLs: imagens } : p);
  renderizarProdutos(produtos);
});

btnAddImg.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;

  input.onchange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
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
        }
      } catch (err) {
        console.error('Erro ao enviar imagem:', err);
        alert('Erro ao enviar uma das imagens. Tente novamente.');
      }
    }
    
    await update(ref(database, `produtos/${produtoAtualId}`), { fotosURLs: imagens });
    imgIndex = imagens.length - 1;
    atualizarImgModal();
    
    // Atualiza na lista
    produtos = produtos.map(p => p.id === produtoAtualId ? { ...p, fotosURLs: imagens } : p);
    renderizarProdutos(produtos);
  };

  input.click();
});

async function excluirProduto(id) {
  if (!confirm("Deseja excluir este produto? Esta ação não pode ser desfeita.")) return;
  
  try {
    await remove(ref(database, `produtos/${id}`));
    alert('Produto excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    alert('Erro ao excluir. Tente novamente.');
  }
}