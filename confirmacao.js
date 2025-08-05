// confirmacao.js

const listaProdutos = document.getElementById("listaProdutos");
const form = document.getElementById("formConfirmacao");
const btnVoltar = document.getElementById("btnVoltar");

// Carrega o resumo dos produtos no <ul>
function carregarProdutosDoCarrinho() {
  const produtos = JSON.parse(localStorage.getItem("vipandroid_checkout")) || [];
  listaProdutos.innerHTML = produtos.length === 0
    ? "<li>Nenhum produto no carrinho.</li>"
    : produtos.map(p => {
        const nome = p.nome || "Produto sem nome";
        const preco = p.preco
          ? ` - R$ ${Number(p.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
          : "";
        return `<li>${nome}${preco}</li>`;
      }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  carregarProdutosDoCarrinho();
  btnVoltar.addEventListener("click", () => {
    window.location.href = "carrinho.html";
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const produtos = JSON.parse(localStorage.getItem("vipandroid_checkout")) || [];
  if (produtos.length === 0) {
    return alert("Carrinho vazio. Adicione produtos antes de finalizar a compra.");
  }

  const dadosCliente = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    cep: document.getElementById("cep").value.trim(),
    rua: document.getElementById("rua").value.trim(),
    bairro: document.getElementById("bairro").value.trim(),
    cidade: document.getElementById("cidade").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    complemento: document.getElementById("complemento").value.trim(),
    referencia: document.getElementById("referencia").value.trim(),
    telefone: document.getElementById("telefone").value.trim()
  };

  try {
    // 🔗 URL completa para o backend no Replit
    const pendenteRes = await fetch("https://vipandroid-1-weslanyvalentim.replit.app/registrar-venda-pendente", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente: dadosCliente, produtos })
    });

    if (!pendenteRes.ok) {
      const texto = await pendenteRes.text();
      throw new Error(`Falha ao registrar venda pendente: ${texto}`);
    }

    const { idVenda } = await pendenteRes.json();

    const itensParaMP = produtos.map(p => ({
      id: p.id,
      title: p.nome,
      description: p.descricao || "",
      quantity: p.quantidade || 1,
      currency_id: "BRL",
      unit_price: Number(p.preco)
    }));

    const mpRes = await fetch("https://vipandroid-1-weslanyvalentim.replit.app/criar-pagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idVenda,
        produtos: itensParaMP
      })
    });

    if (!mpRes.ok) {
      const texto = await mpRes.text();
      throw new Error(`Falha ao criar preferência: ${texto}`);
    }

    const { link } = await mpRes.json();
    window.location.href = link;

  } catch (erro) {
    console.error("Erro na finalização:", erro);
    alert("Erro ao finalizar compra. Veja o console para detalhes.");
  }
});
