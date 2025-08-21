import { alertaError, alertaOK, alertaWarning } from "./js/alertas";

const formulario = document.querySelector("form");
const cedula = document.querySelector(".cedula");
const contrasena = document.querySelector(".contraseña");

const validar = async (e,) => {
  e.preventDefault();
  const validar = [cedula, contrasena];
  let errores = "";
  let cont = 0;
  let cant = 0;
  validar.forEach(valor => {
    if (valor.value.trim() === "") {
      if (cont == 0) {
        cant++
        cont++;
        errores += `${valor.classList[1]}`;
      }
      else {
        cant++
        errores += ` y ${valor.classList[1]}`;
      }
    }
  });
  if (!errores == "") {
    alertaWarning(`${errores} no puede${cant >= 2 ? "n" : ""} estar vacio${cant >= 2 ? "s" : ""} y solo puede${cant >= 2 ? "n" : ""} aceptar numeros.`)
    e.preventDefault;
    return;
  }
  const valido = await esValido(e,cedula.value, contrasena.value);
  if (valido) 
  {
    await alertaOK("Inicio Sesión EXITOSO.");
    formulario.action = `/src/html/menu.html#${cedula.value}`;
    formulario.submit();
  }
};

const esValido = async (e,cedula, contrasena) => {
  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`);
    
    if (!response.ok) {
      const mensaje = await response.text();
      throw new Error(mensaje);
    }
    const data = await response.json();
    
    if (cedula == data.cedula && contrasena == data.contrasena && data.activo == "1") {
      return true;
    }
    else if (cedula == data.cedula && data.activo == "1") {
      const mensaje = "Contraseña INCORRECTA.";
      throw new Error(mensaje);
    }
    else if (cedula == data.cedula && !data.activo ||cedula == data.cedula && data.activo == "0")
    {
      const mensaje = "Usuario NO ACTIVADO";
      throw new Error(mensaje);
    }
  } catch (error) {
    alertaError(error.message);
    e.preventDefault
    return false;
  }
}

const numeros = (event) => {
  if (!/^\d$/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") {
    event.preventDefault();
  }
};

formulario.addEventListener("submit", validar);
cedula.addEventListener("keydown", numeros);