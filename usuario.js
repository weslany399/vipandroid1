import { auth } from "./firebase-config.js";
import { onAuthStateChanged, updatePassword, sendPasswordResetEmail, updateEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Seletores
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userLastLogin = document.getElementById("userLastLogin");
const btnChangePassword = document.getElementById("btnChangePassword");
const btnAddEmail = document.getElementById("btnAddEmail");
const btnDeleteAccount = document.getElementById("btnDeleteAccount");

// Exibir informações do usuário
onAuthStateChanged(auth, (user) => {
  if (user) {
    userName.textContent = user.displayName || "Usuário sem nome";
    userEmail.textContent = user.email;
    userLastLogin.textContent = user.metadata?.lastSignInTime || "Não disponível";
  } else {
    alert("⚠️ Você precisa estar logado para acessar esta página.");
    window.location.href = "login.html";
  }
});

// Alterar senha (envia email de redefinição)
btnChangePassword.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("📩 Um email de redefinição de senha foi enviado.");
  } catch (error) {
    console.error(error);
    alert("❌ Erro ao enviar email de redefinição.");
  }
});

// Adicionar/alterar email
btnAddEmail.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const novoEmail = prompt("Digite o novo email:");
  if (novoEmail) {
    try {
      await updateEmail(user, novoEmail);
      alert("✅ Email atualizado com sucesso!");
      userEmail.textContent = novoEmail;
    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ É necessário fazer login novamente para alterar o email.");
        auth.signOut();
        window.location.href = "login.html";
      } else {
        alert("❌ Erro ao atualizar email.");
      }
    }
  }
});

// Excluir conta
btnDeleteAccount.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const confirmEmail = prompt(`Digite seu email (${user.email}) para confirmar exclusão:`);
  if (confirmEmail === user.email) {
    try {
      await user.delete();
      alert("✅ Conta excluída com sucesso.");
      window.location.href = "home.html";
    } catch (error) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        alert("⚠️ Você precisa fazer login novamente para excluir a conta.");
        auth.signOut();
        window.location.href = "login.html";
      } else {
        alert("❌ Erro ao excluir conta.");
      }
    }
  } else {
    alert("Email incorreto. A conta não foi excluída.");
  }
});
