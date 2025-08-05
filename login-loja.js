import { database, app } from "./firebase-config.js";
import { ref as dbRef, get, update } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const nomeEl  = document.getElementById("nome");
const senhaEl = document.getElementById("senha");
const entrar  = document.getElementById("entrar");
const msgEl   = document.getElementById("msg");

function setMsg(texto, ok = false) {
  msgEl.textContent = texto;
  msgEl.className = "mensagem " + (ok ? "sucesso" : "erro");
}

async function solicitarPermissaoNotificacoes() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permissão para notificações negada");
  }
  // Registrar service worker e obter token
  const registration = await navigator.serviceWorker.register("/service-worker.js");

  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: "BMFskOn8o8fQLaSKYfDmCdaxku30fPIEa2LtPDrbTzZ6BohKRJf_z_rV5XU26SB092f6DTXpEgUUL7ae7ZX6tI0",
    serviceWorkerRegistration: registration
  });

  if (!token) throw new Error("Token FCM não obtido");
  return token;
}

entrar.addEventListener("click", async () => {
  const nome  = nomeEl.value.trim();
  const senha = senhaEl.value.trim();

  if (!nome || !senha) {
    setMsg("Preencha nome e senha.");
    return;
  }

  setMsg("Verificando...", true);

  try {
    const snapshot = await get(dbRef(database, "funcionarios"));
    const funcionarios = [];
    snapshot.forEach(child => {
      funcionarios.push({ key: child.key, val: child.val() });
    });

    let encontrou = false;

    for (const { key: cpf, val: func } of funcionarios) {
      if (func.nome.toLowerCase() === nome.toLowerCase()) {
        encontrou = true;

        if (func.senha !== senha) {
          setMsg("Senha incorreta.");
          return;
        }

        if (!func.aprovado) {
          setMsg("Cadastro ainda não foi aprovado.");
          return;
        }

        // Solicita permissão e token, salva no banco
        try {
          const token = await solicitarPermissaoNotificacoes();
          await update(dbRef(database, `funcionarios/${cpf}`), { token });
          console.log("Token FCM salvo com sucesso:", token);
        } catch (tokenError) {
          console.warn("Erro ao obter token FCM:", tokenError);
        }

        setMsg("Login bem-sucedido! Redirecionando...", true);
        setTimeout(() => {
          window.location.href = "dashboard-loja.html";
        }, 1200);
        break; // sai do loop após sucesso
      }
    }

    if (!encontrou) {
      setMsg("Nome não encontrado.");
    }
  } catch (erro) {
    console.error(erro);
    setMsg("Erro ao buscar dados. Tente novamente.");
  }
});
