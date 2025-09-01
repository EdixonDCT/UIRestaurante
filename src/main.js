import "./style.css";
import { router } from "./Router/router.js";
import componenteHeader from "../src/componentes/header/index.html?raw";
import { componenteHeader as header } from "./componentes/header/header.js";
import validarToken from "./Helpers/token";

document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);
const main = document.querySelector("#app");

window.addEventListener("hashchange", async (e) => {
  validarToken();
  header();
  router(main);
});

window.addEventListener("DOMContentLoaded", async () => {
  validarToken();
  header();
  router(main);
});
