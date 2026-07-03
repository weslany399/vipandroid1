// confirmacao.js

const listaProdutos = document.getElementById("listaProdutos");
const btnVoltar = document.getElementById("btnVoltar");
const btnFinalizar = document.getElementById("btnFinalizar");

// Carrega o resumo dos produtos no <ul>
function carregarProdutosDoCarrinho() {
  const produtos = JSON.parse(localStorage.getItem("vipandroid_checkout")) || [];
  listaProdutos.innerHTML =
    produtos.length === 0
      ? "<li>Nenhum produto no carrinho.</li>"
      : produtos
          .map((p) => {
            const nome = p.nome || "Produto sem nome";
            const preco = p.preco
              ? ` - R$ ${Number(p.preco).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}`
              : "";
            const linkProduto = `detalhes-produto.html?id=${p.id}`;
            return `<li>${nome}${preco} (<a href="${linkProduto}" target="_blank">ver produto</a>)</li>`;
          })
          .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutosDoCarrinho();

  btnVoltar.addEventListener("click", () => {
    window.location.href = "carrinho.html";
  });

  btnFinalizar.addEventListener("click", () => {
    finalizarCompra();
  });
});

function finalizarCompra() {
  const produtos = JSON.parse(localStorage.getItem("vipandroid_checkout")) || [];
  if (produtos.length === 0) {
    return alert("Carrinho vazio. Adicione produtos antes de finalizar a compra.");
  }

  // Dados do cliente
  const dadosCliente = {
    nome: document.getElementById("nome").value.trim(),
    rua: document.getElementById("rua").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    complemento: document.getElementById("complemento").value.trim(),
    referencia: document.getElementById("referencia").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
  };

  // Montar lista de produtos com link
  const listaProdutosTexto = produtos
    .map((p) => {
      const preco = p.preco
        ? `R$ ${Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "";
      const linkProduto = `https://vip-android-746dd.web.app/detalhes-produto.html?id=${p.id}`; // substituir pelo seu domínio
      return `- ${p.nome || "Produto"} ${preco}\n  Link: ${linkProduto}`;
    })
    .join("\n");

  // Mensagem detalhada
  const mensagem = `
*Esta é uma solicitação de compra vinda do aplicativo Vip Android, do cliente descrito abaixo.*
Por favor, verificar disponibilidade do produto escolhido pelo cliente, e responder o mais breve possível.

📌 *Dados do Cliente:*
- Nome: ${dadosCliente.nome}
- Telefone: ${dadosCliente.telefone}
- Endereço: ${dadosCliente.rua}, ${dadosCliente.numero}, ${dadosCliente.bairro}, ${dadosCliente.cidade}
- Complemento: ${dadosCliente.complemento || "-"}
- Referência: ${dadosCliente.referencia || "-"}

🛒 *Produtos Selecionados:*
${listaProdutosTexto}
  `;

  // Número do WhatsApp da loja
  const numeroWhatsApp = "556892451530"; // já no formato internacional
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  // Abrir no WhatsApp
  window.open(url, "_blank");
}
