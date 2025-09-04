import { imagen } from "../../Helpers/api"; // Importa la función imagen desde api.js

export const componenteHeader = () => { // Define y exporta el componente Header
  const botonera_ingresar = document.querySelector(".botonera-ingresar"); // Selecciona el contenedor de botones de ingresar
  const botonera_logeado = document.querySelector(".botonera-logeado"); // Selecciona el contenedor de botones cuando el usuario está logeado
  const header_NombreApellido = document.querySelector(".perfil__nombre"); // Selecciona el elemento para mostrar el nombre del usuario
  const header_Foto = document.querySelector(".perfil__imagen"); // Selecciona el elemento para mostrar la foto de perfil
  const boton_salir = document.querySelector(".boton-salir"); // Selecciona el botón de salir (si existe)

  const crearBotonesMovil = () => { // Función que crea la botonera móvil
    if (document.querySelector(".botoneraMovil")) return; // Evita crearla si ya existe

    const botonera = document.createElement("div"); // Crea un div para la botonera
    botonera.classList.add("botoneraMovil"); // Agrega clase botoneraMovil

    const checkboxContainer = document.createElement("div"); // Crea contenedor para checkbox
    checkboxContainer.classList.add("checkbox-container"); // Agrega clase al contenedor
    const checkbox = document.createElement("input"); // Crea un input
    checkbox.type = "checkbox"; // Lo define como checkbox
    checkbox.id = "HeaderMovil"; // Le da un id al checkbox
    const label = document.createElement("label"); // Crea un label
    label.setAttribute("for", "HeaderMovil"); // Lo asocia con el checkbox
    const imgOff = document.createElement("img"); // Crea una imagen para el menú hamburguesa
    imgOff.src = "../../../public/MenuBurger.png"; // Ruta de la imagen
    imgOff.alt = "Abrir menú"; // Texto alternativo
    imgOff.classList.add("img-off"); // Agrega clase para estilos
    label.appendChild(imgOff); // Inserta la imagen dentro del label
    checkboxContainer.appendChild(checkbox); // Inserta el checkbox en el contenedor
    checkboxContainer.appendChild(label); // Inserta el label en el contenedor

    const logoMovil = document.createElement("div"); // Crea contenedor para logo móvil
    logoMovil.classList.add("logo-movil"); // Agrega clase al contenedor
    const logoImg = document.createElement("img"); // Crea imagen del logo
    logoImg.src = "logo.png"; // Ruta del logo
    logoImg.alt = "Logo"; // Texto alternativo del logo
    logoImg.classList.add("logo"); // Agrega clase al logo
    logoMovil.appendChild(logoImg); // Inserta el logo en el contenedor

    botonera.appendChild(checkboxContainer); // Inserta el checkboxContainer en la botonera
    botonera.appendChild(logoMovil); // Inserta el logo en la botonera

    const header = document.querySelector(".header"); // Selecciona el header
    header.append(botonera); // Inserta la botonera dentro del header

    const contenedorBotones = document.createElement("div"); // Crea un div para los enlaces
    contenedorBotones.classList.add("botonera-enlaces"); // Agrega clase al contenedor
    botonera.appendChild(contenedorBotones); // Inserta el contenedor en la botonera
  };

  const añadirBotonesMoviles = (texto, enlace) => { // Función para añadir botones en el menú móvil
    const boton = document.createElement("a"); // Crea un enlace
    boton.href = enlace; // Asigna la ruta del enlace
    boton.textContent = texto; // Asigna el texto del enlace
    boton.classList.add("boton"); // Agrega clase de botón
    boton.id = "BotonQuitarClase"; // Asigna id al botón
    if (texto == "Cerrar Sesion") { // Si el botón es de cerrar sesión
      boton.classList.add("boton-salir") // Le agrega la clase boton-salir
    }
    const contenedorBotones = document.querySelector(".botonera-enlaces"); // Selecciona el contenedor de botones
    contenedorBotones.appendChild(boton); // Inserta el botón en el contenedor
  };

  const vaciarBotoneraMoviles = () => { // Función para vaciar botones móviles
    const contenedorBotones = document.querySelector(".botonera-enlaces"); // Selecciona el contenedor de enlaces
    if (contenedorBotones) contenedorBotones.innerHTML = ""; // Limpia los botones si existe
  };

  const crearHome = () => { // Función para crear el botón de inicio
    const headerOpciones = botonera_logeado.parentElement.parentElement.querySelector(".nav__list"); // Selecciona la lista de navegación
    headerOpciones.innerHTML = ""; // Limpia las opciones actuales
    const li = document.createElement("li"); // Crea un elemento li
    const a = document.createElement("a"); // Crea un enlace
    a.classList.add("nav__item", "enlace"); // Agrega clases al enlace
    a.href = `#/Home`; // Ruta del enlace
    a.textContent = "Inicio"; // Texto del enlace
    li.appendChild(a); // Inserta el enlace en el li
    headerOpciones.appendChild(li); // Inserta el li en la lista
  };

  const validacion = () => { // Función principal que valida el estado del usuario
    crearBotonesMovil();          // Se asegura de crear el menú móvil solo una vez
    vaciarBotoneraMoviles();      // Limpia los botones previos
    añadirBotonesMoviles("Inicio", `#/Home`); // Añade botón de inicio

    const datos = localStorage.getItem("token"); // Obtiene el token del localStorage
    if (datos) { // Si el usuario está logeado
      botonera_logeado.style.display = "flex"; // Muestra la botonera logeado
      botonera_ingresar.style.display = "none"; // Oculta la botonera ingresar
      header_NombreApellido.textContent = window.localStorage.getItem("nombreApellido"); // Muestra nombre del usuario
      header_Foto.src = imagen(window.localStorage.getItem("fotoPerfil")); // Muestra foto de perfil
      crearHome(); // Crea la opción de inicio en el menú

      const permisos = JSON.parse(window.localStorage.getItem("permisos")); // Obtiene los permisos del usuario
      permisos
        .filter((clave) => clave.includes(".listar")) // Filtra solo permisos con ".listar"
        .map((clave) => { // Recorre cada permiso
          const [objeto] = clave.split("."); // Obtiene el objeto del permiso
          const headerOpciones = botonera_logeado.parentElement.parentElement.querySelector(".nav__list"); // Selecciona la lista de navegación
          const li = document.createElement("li"); // Crea un li
          const a = document.createElement("a"); // Crea un enlace
          a.classList.add("nav__item", "enlace"); // Agrega clases al enlace
          a.href = `#/${objeto}`; // Ruta del enlace
          a.textContent = objeto; // Texto con el nombre del objeto
          li.appendChild(a); // Inserta el enlace en el li
          headerOpciones.appendChild(li); // Inserta el li en la lista
          añadirBotonesMoviles(objeto, `#/${objeto}`); // Añade botón en menú móvil
        });
      añadirBotonesMoviles("Cerrar Sesion", `#/Login`); // Añade botón de cerrar sesión
    } else { // Si el usuario no está logeado
      crearHome(); // Crea botón de inicio
      añadirBotonesMoviles("Iniciar Sesion", `#/Login`); // Añade botón de iniciar sesión
      añadirBotonesMoviles("Registrarse", `#/Signup`); // Añade botón de registrarse
      botonera_logeado.style.display = "none"; // Oculta botonera de logeado
      botonera_ingresar.style.display = "flex"; // Muestra botonera de ingresar
    }
  };

  validacion(); // Ejecuta la validación al cargar el componente

  document.querySelectorAll(".boton-salir").forEach((boton) => { // Selecciona todos los botones salir
    boton.addEventListener("click", () => { // Añade evento click
      localStorage.clear(); // Limpia el localStorage
      validacion(); // Ejecuta validación de nuevo
    });
  });
};

window.addEventListener("click", async (e) => { // Evento global de clicks
  if (e.target.id === "HeaderMovil") { // Si se hace click en el checkbox del header móvil
    if (e.target.checked) { // Si está activado
      const padre = e.target.parentElement.parentElement; // Obtiene el padre del checkbox
      const botonera = padre.querySelector(".botonera-enlaces"); // Selecciona la botonera de enlaces
      botonera.classList.add("checkeadoBotonera"); // Agrega clase para mostrar menú
    }
  } else if (e.target.id === "BotonQuitarClase") { // Si se hace click en un botón que quita la clase
    const padre = e.target.parentElement; // Obtiene el padre del botón
    if (padre) { 
      padre.classList.remove("checkeadoBotonera"); // Quita la clase que muestra el menú
    } else {
      const botonera = document.querySelector(".checkeadoBotonera"); // Busca un menú activo
      if (botonera) {
        botonera.classList.remove("checkeadoBotonera"); // Quita la clase si existe
      }
    }
  }
});
