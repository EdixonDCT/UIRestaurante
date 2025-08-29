import { imagen } from "../../Helpers/api";
export const componenteHeader = () => {
  const botonera_ingresar = document.querySelector(".botonera-ingresar");
  const botonera_logeado = document.querySelector(".botonera-logeado");
  const header_NombreApellido = document.querySelector(".perfil__nombre");
  const header_Foto = document.querySelector(".perfil__imagen");
  const boton_salir = document.querySelector(".boton-salir");

  const crearHome = () => {
    const headerOpciones = botonera_logeado.parentElement.parentElement.querySelector(".nav__list");
    headerOpciones.innerHTML = "";
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.classList.add("nav__item", "enlace");
    a.href = `#/Home`;
    a.textContent = "Inicio";
    li.appendChild(a);
    headerOpciones.appendChild(li);
  }
  const validacion = () => {
    const datos = localStorage.getItem("token");
    if (datos) {
      botonera_logeado.style.display = "flex";
      botonera_ingresar.style.display = "none";
      header_NombreApellido.textContent =
      window.localStorage.getItem("nombreApellido");
      header_Foto.src = imagen(window.localStorage.getItem("fotoPerfil"));
      crearHome();
      const permisos = JSON.parse(window.localStorage.getItem("permisos"));
      permisos
        .filter((clave) => clave.includes(".listar"))
        .map((clave) => {
          const [objeto, propiedad] = clave.split(".");
          const headerOpciones = botonera_logeado.parentElement.parentElement.querySelector(".nav__list");
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.classList.add("nav__item", "enlace");
          a.href = `#/${objeto}`;
          a.textContent = objeto;
          li.appendChild(a);
          headerOpciones.appendChild(li);
        });
    } else {
      crearHome();
      botonera_logeado.style.display = "none";
      botonera_ingresar.style.display = "flex";
    }
  };
  validacion();

  boton_salir.addEventListener("click", () => {
    localStorage.clear();
    validacion();
  });
};
