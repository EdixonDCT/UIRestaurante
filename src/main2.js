import "./style.css";
import { router } from "./Router/router.js";
import componenteHeader from "../src/componentes/header/index.html?raw";
import { componenteHeader as header } from "./componentes/header/header.js";

document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);

const main = document.querySelector("#app");

header();

window.addEventListener("hashchange", async (e) => {
  router(main);
});

window.addEventListener("DOMContentLoaded", async () => {
  router(main);
});
