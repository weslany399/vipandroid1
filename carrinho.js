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
            <button onclick="confirmarRemoverUm(${i})">➖ Remover 1</button>
            <button onclick="confirmarRemoverTudo(${i})">❌ Remover tudo</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += produtoHTML;
  });

  subtotalFinalEl.innerHTML = `🧾 Subtotal: R$ ${subtotal.toFixed(2)}`;
}

// Confirmação antes de remover 1 unidade
window.confirmarRemoverUm = function(index) {
  const confirmar = confirm("Você tem certeza que deseja remover uma unidade deste item?");
  if (confirmar) {
    const carrinho = JSON.parse(localStorage.getItem('vipandroid_checkout')) || [];
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade -= 1;
    } else {
      carrinho.splice(index, 1);
    }
    localStorage.setItem('vipandroid_checkout', JSON.stringify(carrinho));
    carregarCarrinho();
  }
};

// Confirmação antes de remover tudo
window.confirmarRemoverTudo = function(index) {
  const confirmar = confirm("Você tem certeza que deseja remover este item do carrinho?");
  if (confirmar) {
    const carrinho = JSON.parse(localStorage.getItem('vipandroid_checkout')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('vipandroid_checkout', JSON.stringify(carrinho));
    carregarCarrinho();
  }
};

window.prosseguirComACompra = function () {
  if (!window.produtosParaPagamento || window.produtosParaPagamento.length === 0) {
    alert("Nenhum produto selecionado.");
    return;
  }

  localStorage.setItem("vipandroid_checkout", JSON.stringify(window.produtosParaPagamento));
  window.location.href = "confirmacao.html";
};

window.voltarDetalhes = function () {
  window.location.href = "home.html";
};

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

document.addEventListener("DOMContentLoaded", () => {
  carregarCarrinho();
  atualizarCarrinhoFloat();
});
