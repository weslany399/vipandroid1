import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBfQdAX3P6VU7GWMIK5pLq7IYRuTimDvvo",
    authDomain: "vip-android-746dd.firebaseapp.com",
    projectId: "vip-android-746dd",
    storageBucket: "vip-android-746dd.appspot.com",
    messagingSenderId: "1095417596528",
    appId: "1:1095417596528:web:5a8a835451989808918265"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const vendasRef = collection(db, "vendas");

  const listaVendas = document.getElementById("listaVendas");
  const filtroCliente = document.getElementById("filtroCliente");
  const filtroProduto = document.getElementById("filtroProduto");
  const filtroDataInicio = document.getElementById("filtroDataInicio");
  const filtroDataFim = document.getElementById("filtroDataFim");
  const btnImprimirTudo = document.getElementById("btnImprimirTudo");
  const btnApagarTudo = document.getElementById("btnApagarTudo");
  const btnVoltar = document.getElementById("btnVoltar");

  let todasVendas = [];

  btnVoltar.addEventListener("click", () => {
    window.location.href = "dashboard-loja.html";
  });

  function formatarData(dataISO) {
    if (!dataISO) return "—";
    const dt = new Date(dataISO);
    return dt.toLocaleDateString("pt-BR") + " " + dt.toLocaleTimeString("pt-BR");
  }

  function renderizarVendas(vendas) {
    listaVendas.innerHTML = "";
    if (vendas.length === 0) {
      listaVendas.innerHTML = "<p>Nenhuma venda encontrada.</p>";
      btnImprimirTudo.style.display = "none";
      btnApagarTudo.style.display = "none";
      return;
    }

    vendas.forEach((v, i) => {
      const cliente = v.cliente || {};
      const produtos = v.produtos || [];

      const div = document.createElement("div");
      div.className = "venda";
      div.innerHTML = `
        <button class="btn-excluir" title="Excluir venda" aria-label="Excluir venda">
          <i class="fas fa-trash-alt"></i>
        </button>
        <h3>Venda ${i + 1}</h3>
        <p><strong>Criada em:</strong> ${formatarData(v.criadoEm)}</p>
        <p><strong>Aprovada em:</strong> ${formatarData(v.dataAprovado)}</p>

        <h4>Cliente</h4>
        <p><strong>Nome:</strong> ${cliente.nome || "—"}</p>
        <p><strong>Email:</strong> ${cliente.email || "—"}</p>
        <p><strong>CPF:</strong> ${cliente.cpf || "—"}</p>
        <p><strong>Telefone:</strong> ${cliente.telefone || "—"}</p>
        <p><strong>CEP:</strong> ${cliente.cep || "—"}</p>
        <p><strong>Rua:</strong> ${cliente.rua || "—"}</p>
        <p><strong>Número:</strong> ${cliente.numero || "—"}</p>
        <p><strong>Bairro:</strong> ${cliente.bairro || "—"}</p>
        <p><strong>Cidade:</strong> ${cliente.cidade || "—"}</p>
        <p><strong>Complemento:</strong> ${cliente.complemento || "—"}</p>
        <p><strong>Referência:</strong> ${cliente.referencia || "—"}</p>

        <h4>Produtos</h4>
        <ul>
          ${produtos.map(p => `
            <li>
              <strong>${p.marca || ""} ${p.nome || ""}</strong><br>
              Quantidade: ${p.quantidade || 1}, Preço unitário: R$ ${Number(p.preco).toFixed(2)}<br>
              Especificações: Bateria ${p.bateria}mAh, Memória ${p.memoria}GB, Tela ${p.tela}", 
              Câmeras ${p.cameraTraseira}MP / ${p.cameraFrontal}MP
            </li>
          `).join("")}
        </ul>

        <p><strong>Status:</strong></p>
        <select class="select-status" data-id="${v._id}">
          <option value="andamento" ${v.status === "andamento" ? "selected" : ""}>Em andamento</option>
          <option value="saida" ${v.status === "saida" ? "selected" : ""}>Saiu para entrega</option>
          <option value="entregue" ${v.status === "entregue" ? "selected" : ""}>Entregue</option>
        </select>

        <p><strong>Forma de Pagamento:</strong> ${v.formaPagamento || "—"}</p>
        <p><strong>Valor Pago:</strong> R$ ${Number(v.valorPago).toFixed(2)}</p>

        <button class="btn-imprimir">🖨️ Imprimir esta venda</button>
      `;

      // Evento excluir individual
      div.querySelector(".btn-excluir").addEventListener("click", async () => {
        if (confirm("Excluir esta venda?")) {
          try {
            await deleteDoc(doc(db, "vendas", v._id));
            alert("Venda excluída!");
            carregarVendas();
          } catch (err) {
            alert("Erro ao excluir venda.");
            console.error(err);
          }
        }
      });

      // Evento imprimir
      div.querySelector(".btn-imprimir").addEventListener("click", () => {
        const original = document.body.innerHTML;
        document.body.innerHTML = div.outerHTML;
        window.print();
        document.body.innerHTML = original;
        carregarVendas();
      });

      // Evento alteração de status
      div.querySelector(".select-status").addEventListener("change", async (e) => {
        const novoStatus = e.target.value;
        try {
          await updateDoc(doc(db, "vendas", v._id), { status: novoStatus });
          alert(`Status atualizado para: ${novoStatus}`);
          carregarVendas();
        } catch (err) {
          alert("Erro ao atualizar status.");
          console.error(err);
        }
      });

      listaVendas.appendChild(div);
    });

    btnImprimirTudo.style.display = "inline-block";
    btnApagarTudo.style.display = "inline-block";
  }

  function aplicarFiltros() {
    const clienteFiltro = filtroCliente.value.trim().toLowerCase();
    const produtoFiltro = filtroProduto.value.trim().toLowerCase();
    const dataInicio = filtroDataInicio.value;
    const dataFim = filtroDataFim.value;

    const filtradas = todasVendas
      .filter(v => ["approved", "andamento", "saida", "entregue"].includes(v.status))
      .filter(v => {
        const nomeEmail = (v.cliente?.nome + " " + v.cliente?.email).toLowerCase();
        return nomeEmail.includes(clienteFiltro);
      })
      .filter(v => {
        if (!produtoFiltro) return true;
        return v.produtos.some(p => ((p.nome || "") + " " + (p.marca || "")).toLowerCase().includes(produtoFiltro));
      })
      .filter(v => {
        if (!dataInicio && !dataFim) return true;
        const dataVenda = new Date(v.criadoEm);
        if (dataInicio && dataVenda < new Date(dataInicio + "T00:00:00")) return false;
        if (dataFim && dataVenda > new Date(dataFim + "T23:59:59")) return false;
        return true;
      });

    renderizarVendas(filtradas);
  }

  async function carregarVendas() {
    const snapshot = await getDocs(vendasRef);
    todasVendas = snapshot.docs.map(docSnap => ({
      ...docSnap.data(),
      _id: docSnap.id
    }));
    aplicarFiltros();
  }

  btnImprimirTudo.addEventListener("click", () => window.print());

  btnApagarTudo.addEventListener("click", async () => {
    if (confirm("Deseja apagar todas as vendas?")) {
      for (const v of todasVendas) {
        await deleteDoc(doc(db, "vendas", v._id));
      }
      alert("Todas as vendas foram apagadas.");
      carregarVendas();
    }
  });

  filtroCliente.addEventListener("input", aplicarFiltros);
  filtroProduto.addEventListener("input", aplicarFiltros);
  filtroDataInicio.addEventListener("change", aplicarFiltros);
  filtroDataFim.addEventListener("change", aplicarFiltros);

  carregarVendas();
});
