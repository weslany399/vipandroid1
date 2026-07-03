/* -------- Funções do Carrinho -------- */

async function carregarCarrinho() {
  const container = document.getElementById('carrinhoContainer');
  const subtotalFinalEl = document.getElementById('subtotalFinal');

  const carrinho = JSON.parse(localStorage.getItem('vipandroid_checkout')) || [];

  if (carrinho.length === 0) {
    container.innerHTML = "<p style='text-align:center; font-size:18px;'>Seu carrinho está vazio.</p>";
    subtotalFinalEl.textContent = '';
    return;
  }

  let subtotal = 0;
  container.innerHTML = '';
  window.produtosParaPagamento = [];

  carrinho.forEach((p, i) => {
    const precoUnitario = p.precoOferta
      ? parseFloat(p.precoOferta)
      : parseFloat(p.preco);

    const quantidade = p.quantidade || 1;
    const subtotalProduto = precoUnitario * quantidade;
    subtotal += subtotalProduto;

    window.produtosParaPagamento.push({
      ...p,
      preco: precoUnitario.toFixed(2)
    });

    const precoHTML = p.precoAntigo
      ? `
        <p class="preco-ant">R$ ${Number(p.precoAntigo).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
        <p class="preco-oferta">R$ ${Number(precoUnitario).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
      `
      : `<p class="preco">R$ ${precoUnitario.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>`;

    const freteHTML = p.freteGratis ? `<p class="frete">🚚 Frete Grátis</p>` : '';
    const descricaoExtra = p.descricao ? `<p class="descricao-extra">${p.descricao}</p>` : '';
    const quantidadeHTML = `<p class="quantidade">Quantidade: ${quantidade}</p>`;

    const produtoHTML = `
      <div class="produto-card">
        <img src="${p.fotosURLs?.[0] || 'imagens/placeholder.jpg'}" alt="${p.nome}" class="miniatura-produto">
        <div class="produto-info">
          <h3>${p.marca ?? ''} ${p.nome ?? ''}</h3>
          ${freteHTML}
          ${descricaoExtra}
          ${precoHTML}
          ${quantidadeHTML}
          <div class="botoes-carrinho">
            <button onclick="mostrarModalRemoverUm(${i})">➖ Remover 1</button>
            <button onclick="mostrarModalRemoverTudo(${i})">❌ Remover tudo</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += produtoHTML;
  });

  subtotalFinalEl.innerHTML = `🧾 Subtotal: R$ ${subtotal.toFixed(2)}`;
}

/* -------- Modal Personalizado -------- */

const modalContainer = document.createElement('div');
modalContainer.id = 'modalConfirmacao';
modalContainer.style = `
  display:none;
  position:fixed;
  top:0;left:0;
  width:100%;height:100%;
  background: rgba(0,0,0,0.7);
  justify-content:center;
  align-items:center;
  z-index:10000;
`;
modalContainer.innerHTML = `
  <div style="
    background:#fff;
    padding:20px;
    border-radius:10px;
    max-width:400px;
    width:90%;
    text-align:center;
    color:#000; /* Cor do texto */
    font-family: Arial, sans-serif;
  ">
    <p id="modalMensagem" style="font-size:16px;margin-bottom:20px;color:#000;"></p>
    <button id="modalConfirmar" style="margin-right:10px;padding:6px 14px;background:#00cc66;color:#fff;border:none;border-radius:5px;cursor:pointer;">Sim</button>
    <button id="modalCancelar" style="padding:6px 14px;background:#ff3333;color:#fff;border:none;border-radius:5px;cursor:pointer;">Cancelar</button>
  </div>
`;
document.body.appendChild(modalContainer);

let modalCallback = null;

function mostrarModal(msg, callback) {
  document.getElementById('modalMensagem').textContent = msg;
  modalContainer.style.display = 'flex';
  modalCallback = callback;
}

document.getElementById('modalConfirmar').onclick = () => {
  if (modalCallback) modalCallback();
  modalContainer.style.display = 'none';
};

document.getElementById('modalCancelar').onclick = () => {
  modalContainer.style.display = 'none';
};

/* -------- Funções de Remoção com Modal -------- */

window.mostrarModalRemoverUm = function(index) {
  mostrarModal("Deseja realmente remover 1 unidade deste item?", () => {
    const carrinho = JSON.parse(localStorage.getItem('vipandroid_checkout')) || [];
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade -= 1;
    } else {
      carrinho.splice(index, 1);
    }
    localStorage.setItem('vipandroid_checkout', JSON.stringify(carrinho));
    carregarCarrinho();
  });
};

window.mostrarModalRemoverTudo = function(index) {
  mostrarModal("Deseja realmente remover este item do carrinho?", () => {
    const carrinho = JSON.parse(localStorage.getItem('vipandroid_checkout')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('vipandroid_checkout', JSON.stringify(carrinho));
    carregarCarrinho();
  });
};

/* -------- Checkout e Voltar -------- */

window.prosseguirComACompra = function () {
  if (!window.produtosParaPagamento || window.produtosParaPagamento.length === 0) {
    alert("Nenhum produto selecionado.");
    return;
  }
  localStorage.setItem("vipandroid_checkout", JSON.stringify(window.produtosParaPagamento));
  window.location.href = "confirmacao.html";
};

window.voltarDetalhes = function () {
  window.location.href = "index.html";
};

/* -------- Carrinho Flutuante -------- */

function atualizarCarrinhoFloat() {
  const c = JSON.parse(localStorage.getItem("vipandroid_checkout") || "[]");
  const cartFloat = document.getElementById("cartFloat");
  if (cartFloat) {
    cartFloat.classList.toggle("oculto", c.length === 0);
    cartFloat.onclick = () => {
      window.location.href = "carrinho.html";
    };
  }
}

/* -------- Inicialização -------- */

document.addEventListener("DOMContentLoaded", () => {
  carregarCarrinho();
  atualizarCarrinhoFloat();
});
