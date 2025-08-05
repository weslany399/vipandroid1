// js/menu.js

const menuBotao = document.getElementById("menuBotao");
const menuLateral = document.querySelector(".menu-lateral");

menuBotao.addEventListener("click", () => {
  menuLateral.classList.toggle("visivel");
});
