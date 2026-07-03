// andamento.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { traduzirPagina } from "./global.js"; // Importa função de tradução

// Config Firebase
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

// Elementos do DOM
const form = document.getElementById("formCPF");
const cpfInput = document.getElementById("cpfInput");
const resultado = document.getElementById("resultado");
const erro = document.getElementById("erro");
const contato = document.getElementById("contato");

// Função para formatar data ISO
function formatarData(isoString) {
  if (!isoString) return "N/D";
  const data = new Date(isoString);
  return data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
}

// Função para traduzir status da entrega
function traduzirStatus(status) {
  if (!status) return "N/D";
  const s = status.toLowerCase();
  if (s === "pending") return "Pendente";
  if (s === "saida") return "Saiu para entrega";
  if (s === "entregue") return "Entregue";
  return status;
}

// ✅ Função para aplicar tema claro/escuro
function aplicarTema() {
  const temaSalvo = localStorage.getItem("tema") || "claro";
  document.body.classList.toggle("escuro", temaSalvo === "escuro");
}

// ✅ Função para aplicar idioma
function aplicarIdiomaNaPagina() {
  const idioma = localStorage.getItem("idioma") || "pt";
  if (traduzirPagina) {
    traduzirPagina(idioma);
  }
}

// Observa mudanças no localStorage
window.addEventListener("storage", (event) => {
  if (event.key === "tema") aplicarTema();
  if (event.key === "idioma") aplicarIdiomaNaPagina();
});

// Função para consultar vendas
async function consultarVendas(cpf) {
  try {
    const vendasRef = collection(db, "vendas");
    const q = query(vendasRef, where("cliente.cpf", "==", cpf));
    const querySnapshot = await getDocs(q);

    resultado.innerHTML = "";
    resultado.style.display = "none";
    contato.style.display = "none";

    if (querySnapshot.empty) {
      erro.textContent = "Nenhuma venda encontrada para esse CPF. Por favor, digite um CPF válido.";
      erro.style.display = "block";
      return;
    }

    let html = "<h2>📦 Vendas encontradas:</h2>";

    querySnapshot.forEach((doc, index) => {
      const venda = doc.data();
      const cliente = venda.cliente || {};
      const produtos = venda.produtos || [];

      const dataVendaFormatada = formatarData(venda.criadoEm || venda.dataAprovado);
      const statusEntrega = traduzirStatus(venda.status);

      html += `<div class="venda-box">
        <h3>🛒 Venda ${index + 1}</h3>
        <p><strong>Nome:</strong> ${cliente.nome || "N/D"}</p>
        <p><strong>CPF:</strong> ${cliente.cpf || "N/D"}</p>
        <p><strong>Endereço:</strong> ${cliente.rua || ""}, ${cliente.numero || ""}, ${cliente.bairro || ""}, ${cliente.cidade || ""}</p>
        <p><strong>Referência:</strong> ${cliente.referencia || "N/D"}</p>
        <p><strong>Forma de Pagamento:</strong> ${venda.formaPagamento || "N/D"}</p>
        <p><strong>Data da Venda:</strong> ${dataVendaFormatada}</p>
        <p class="status-entrega"><strong>Status da Entrega:</strong> ${statusEntrega}</p>`;

      produtos.forEach((produto, i) => {
        html += `
          <div class="produto-box">
            <h4>📦 Produto ${i + 1}</h4>
            <p><strong>Nome:</strong> ${produto.nome || "N/D"}</p>
            <p><strong>Marca:</strong> ${produto.marca || "N/D"}</p>
            <p><strong>Preço Pago:</strong> R$ ${produto.valorPago || venda.valorPago || "N/D"}</p>
            <p><strong>Armazenamento:</strong> ${produto.armazenamento || "N/D"} GB</p>
            <p><strong>Memória:</strong> ${produto.memoria || "N/D"} GB</p>
            <p><strong>Cor:</strong> ${produto.coresDetalhadas?.map(c => c.nome).join(", ") || "N/D"}</p>
            <img src="${produto.fotosURLs?.[0] || ''}" alt="Imagem do produto" style="max-width:150px; margin-top: 5px;" />
          </div>
        `;
      });

      html += `</div><hr/>`;
    });

    resultado.innerHTML = html;
    resultado.style.display = "block";
    contato.style.display = "block";
    erro.style.display = "none";
  } catch (error) {
    console.error("Erro ao consultar vendas:", error);
    erro.textContent = "Erro ao buscar as vendas. Tente novamente mais tarde.";
    erro.style.display = "block";
  }
}

// Evento do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const cpf = cpfInput.value.trim();
  if (!/^\d{11}$/.test(cpf)) {
    erro.textContent = "Por favor, digite um CPF válido com 11 números.";
    erro.style.display = "block";
    return;
  }
  consultarVendas(cpf);
});

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  aplicarTema();
  aplicarIdiomaNaPagina();
});
