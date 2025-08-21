export const componenteHeader = () => {
  const header = document.querySelector("header");
  const bloque = document.querySelector(".header__acciones");

  const botonera_ingresar = document.querySelector(".botonera-ingresar");
  const botonera_logeado = document.querySelector(".botonera-logeado");
  const boton_salir = document.querySelector(".boton-salir"); 
  
  const validacion = () => {
    const datos = localStorage.getItem("token");
    if (datos) {
      botonera_logeado.style.display = "flex";
      botonera_ingresar.style.display = "none";;
    } else {
      botonera_logeado.style.display = "none";
      botonera_ingresar.style.display = "flex";
    }
  };
  validacion();

  window.addEventListener("evento", () => {
    console.log(document.querySelector("header"));
    validacion();
  });
  boton_salir.addEventListener("click", () => {
    localStorage.clear();
    validacion();
  });
};
