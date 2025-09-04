import { imagen } from "../../Helpers/api";

export const componenteHeader = () => {
  const botonera_ingresar = document.querySelector(".botonera-ingresar");
  const botonera_logeado = document.querySelector(".botonera-logeado");
  const header_NombreApellido = document.querySelector(".perfil__nombre");
  const header_Foto = document.querySelector(".perfil__imagen");
  const boton_salir = document.querySelector(".boton-salir");

  const crearBotonesMovil = () => {
    // 🔥 Si ya existe, no la vuelvas a crear
    if (document.querySelector(".botoneraMovil")) return;

    const botonera = document.createElement("div");
    botonera.classList.add("botoneraMovil");

    // Checkbox + Label
    const checkboxContainer = document.createElement("div");
    checkboxContainer.classList.add("checkbox-container");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "HeaderMovil";
    const label = document.createElement("label");
    label.setAttribute("for", "HeaderMovil");
    const imgOff = document.createElement("img");
    imgOff.src = "../../../public/MenuBurger.png";
    imgOff.alt = "Abrir menú";
    imgOff.classList.add("img-off");
    label.appendChild(imgOff);
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);

    // Logo móvil
    const logoMovil = document.createElement("div");
    logoMovil.classList.add("logo-movil");
    const logoImg = document.createElement("img");
    logoImg.src = "logo.png";
    logoImg.alt = "Logo";
    logoImg.classList.add("logo");
    logoMovil.appendChild(logoImg);

    // Ensamblar
    botonera.appendChild(checkboxContainer);
    botonera.appendChild(logoMovil);

    const header = document.querySelector(".header");
    header.append(botonera);

    // Contenedor de enlaces
    const contenedorBotones = document.createElement("div");
    contenedorBotones.classList.add("botonera-enlaces");
    botonera.appendChild(contenedorBotones);
  };

  const añadirBotonesMoviles = (texto, enlace) => {
    const boton = document.createElement("a");
    boton.href = enlace;
    boton.textContent = texto;
    boton.classList.add("boton");
    boton.id = "BotonQuitarClase";
    if (texto == "Cerrar Sesion") {
      boton.classList.add("boton-salir")
    }
    const contenedorBotones = document.querySelector(".botonera-enlaces");
    contenedorBotones.appendChild(boton);
  };

  const vaciarBotoneraMoviles = () => {
    const contenedorBotones = document.querySelector(".botonera-enlaces");
    if (contenedorBotones) contenedorBotones.innerHTML = "";
  };

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
  };

  const validacion = () => {
    crearBotonesMovil();          // Se asegura de crearla solo una vez
    vaciarBotoneraMoviles();      // Limpia los enlaces previos
    añadirBotonesMoviles("Inicio", `#/Home`);

    const datos = localStorage.getItem("token");
    if (datos) {
      botonera_logeado.style.display = "flex";
      botonera_ingresar.style.display = "none";
      header_NombreApellido.textContent = window.localStorage.getItem("nombreApellido");
      header_Foto.src = imagen(window.localStorage.getItem("fotoPerfil"));
      crearHome();

      const permisos = JSON.parse(window.localStorage.getItem("permisos"));
      permisos
        .filter((clave) => clave.includes(".listar"))
        .map((clave) => {
          const [objeto] = clave.split(".");
          const headerOpciones = botonera_logeado.parentElement.parentElement.querySelector(".nav__list");
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.classList.add("nav__item", "enlace");
          a.href = `#/${objeto}`;
          a.textContent = objeto;
          li.appendChild(a);
          headerOpciones.appendChild(li);
          añadirBotonesMoviles(objeto, `#/${objeto}`);
        });
      añadirBotonesMoviles("Cerrar Sesion", `#/Login`);
    } else {
      crearHome();
      añadirBotonesMoviles("Iniciar Sesion", `#/Login`);
      añadirBotonesMoviles("Registrarse", `#/Signup`);
      botonera_logeado.style.display = "none";
      botonera_ingresar.style.display = "flex";
    }
  };

  validacion();

  document.querySelectorAll(".boton-salir").forEach((boton) => {
    boton.addEventListener("click", () => {
      localStorage.clear();
      validacion();
    });
  });
};

// Listener global
window.addEventListener("click", async (e) => {
  if (e.target.id === "HeaderMovil") {
    if (e.target.checked) {
      const padre = e.target.parentElement.parentElement;
      const botonera = padre.querySelector(".botonera-enlaces");
      botonera.classList.add("checkeadoBotonera");
    }
  } else if (e.target.id === "BotonQuitarClase") {
    const padre = e.target.parentElement;
    if (padre) {
      padre.classList.remove("checkeadoBotonera");
    } else {
      const botonera = document.querySelector(".checkeadoBotonera");
      if (botonera) {
        botonera.classList.remove("checkeadoBotonera");
      }
    }
  }
});
