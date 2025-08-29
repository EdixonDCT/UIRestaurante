import "./style.css";
import { router } from "./Router/router.js";
import componenteHeader from "../src/componentes/header/index.html?raw";
import { componenteHeader as header } from "./componentes/header/header.js";
import * as validacion from "./Helpers/validaciones";
import validarToken from "./Helpers/token";

document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);
const main = document.querySelector("#app");

const quitarDatos = () => {
  for (let dato in validacion.datos) {//se borra los datos de validacion porque se mantienen aunque se cambie de pagina y genera error
  delete validacion.datos[dato];
}
}

window.addEventListener("hashchange", async (e) => {
  validarToken();
  quitarDatos();
  header();
  router(main);
});

window.addEventListener("DOMContentLoaded", async () => {
  validarToken();
  quitarDatos();
  header();
  router(main);
});
