// js/auth.js
import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// === LOGIN COM E-MAIL E SENHA ===
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("password").value.trim();

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      alert("Login realizado com sucesso!");
      window.location.href = "home.html";
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login: " + traduzErro(error.code));
    }
  });
}

// === LOGIN COM GOOGLE ===
const googleLogin = document.getElementById("googleLogin");
if (googleLogin) {
  googleLogin.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Login com Google realizado!");
      window.location.href = "home.html";
    } catch (error) {
      console.error("Erro no Google:", error);
      alert("Erro ao entrar com Google: " + traduzErro(error.code));
    }
  });
}

// === ESQUECI MINHA SENHA ===
const resetLink = document.getElementById("resetSenha");
if (resetLink) {
  resetLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = prompt("Digite seu e-mail para redefinir a senha:");

    if (!email || !email.includes("@") || !email.includes(".")) {
      alert("Digite um e-mail válido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("E-mail de redefinição enviado! Verifique sua caixa de entrada ou spam.");
    } catch (error) {
      console.error("Erro redefinindo senha:", error);
      alert("Erro ao enviar e-mail: " + traduzErro(error.code));
    }
  });
}

// === CADASTRO DE NOVO USUÁRIO ===
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
      alert("Conta criada com sucesso!");
      window.location.href = "index.html"; // volta pro login
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar: " + traduzErro(error.code));
    }
  });
}

// === TRADUÇÃO DOS CÓDIGOS DE ERRO DO FIREBASE ===
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
