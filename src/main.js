import "./style.css"; // Importa los estilos globales
import { router } from "./Router/router.js"; // Importa el enrutador SPA
import componenteHeader from "../src/componentes/header/index.html?raw"; // Importa el HTML del header como string
import { componenteHeader as header } from "./componentes/header/header.js"; // Importa la función que controla el header
import validarToken from "./Helpers/token"; // Importa la función que valida el token de sesión

// Inserta el header en el body al inicio
document.querySelector("body").insertAdjacentHTML("afterbegin", componenteHeader);

const main = document.querySelector("#app"); // Referencia al contenedor principal donde se cargan las vistas

// Evento que escucha cambios en el hash de la URL (cuando el usuario navega)
window.addEventListener("hashchange", async (e) => {
  validarToken(); // Valida que el token siga siendo válido
  header(); // Actualiza el header (por ejemplo, menú según permisos)
  router(main); // Llama al router para cargar la vista correspondiente
});

// Evento que se dispara cuando el DOM está completamente cargado
window.addEventListener("DOMContentLoaded", async () => {
  validarToken(); // Valida token al cargar la página
  header(); // Renderiza el header
  router(main); // Carga la vista inicial según la ruta actual
});
