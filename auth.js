import { auth } from "./firebase-config.js"; 
import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// === 1. MANTER LOGIN ATIVO ===
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Persistência ativada."))
  .catch((error) => console.error("Erro persistência:", error));

// === 2. VERIFICA LOGIN E REDIRECIONA ===
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;

  const isIndexPage = path.endsWith("index.html") || path.endsWith("/");
  const isLoginPage = path.endsWith("login.html");
  const isRegisterPage = path.endsWith("register.html");

  if (user) {
    // já logado → não deve ficar em login/register
    if (isLoginPage || isRegisterPage) {
      window.location.href = "index.html";
    }

    // no index mostra botão "Sair"
    if (isIndexPage) {
      mostrarLogout();
    }
  } else {
    // não logado
    if (!isIndexPage && !isLoginPage && !isRegisterPage) {
      // qualquer página fora index/login/register exige login
      window.location.href = "login.html";
    }

    // no index mostra botões Login/Registrar
    if (isIndexPage) {
      mostrarLoginRegister();
    }
  }
});

// === 3. LOGIN COM E-MAIL E SENHA ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("✅ Login realizado!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login: " + traduzErro(error.code));
    }
  });
}

// === 4. LOGIN COM GOOGLE ===
const googleLogin = document.getElementById("googleLogin");
if (googleLogin) {
  googleLogin.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("✅ Login com Google realizado!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro no Google:", error);
      alert("Erro ao entrar com Google: " + traduzErro(error.code));
    }
  });
}

// === 5. ESQUECI MINHA SENHA ===
const resetLink = document.getElementById("resetSenha");
if (resetLink) {
  resetLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Digite seu e-mail para redefinir a senha:");

    if (!email || !email.includes("@")) {
      alert("Digite um e-mail válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("📧 E-mail de redefinição enviado!");
    } catch (error) {
      console.error("Erro redefinindo senha:", error);
      alert("Erro ao enviar e-mail: " + traduzErro(error.code));
    }
  });
}

// === 6. CADASTRO DE NOVO USUÁRIO ===
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      await updateProfile(userCredential.user, { displayName: nome });
      alert("🎉 Conta criada com sucesso!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + traduzErro(error.code));
    }
  });
}

// === 7. BOTÕES DO TOPO (INDEX.HTML) ===
function mostrarLoginRegister() {
  const topbar = document.getElementById("topbar");
  if (topbar) {
    topbar.innerHTML = `
      <button onclick="location.href='login.html'">Login</button>
      <button onclick="location.href='register.html'">Registrar</button>
    `;
  }
}

function mostrarLogout() {
  const topbar = document.getElementById("topbar");
  if (topbar) {
    topbar.innerHTML = `
      <span>Bem-vindo!</span>
      <button id="logoutBtn">Sair</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      location.href = "index.html";
    });
  }
}

// === 8. TRADUZIR ERROS ===
function traduzErro(code) {
  const erros = {
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/email-already-in-use": "E-mail já está sendo usado.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/invalid-credential": "Credenciais inválidas. Verifique e-mail e senha.",
  };
  return erros[code] || "Erro desconhecido. Tente novamente.";
}
