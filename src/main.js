import { alertaError, alertaOK, alertaWarning } from "./js/alertas"; // importa funciones de alertas

const formulario = document.querySelector("form"); // selecciona el formulario
const cedula = document.querySelector(".cedula"); // selecciona input cedula
const contrasena = document.querySelector(".contraseña"); // selecciona input contraseña

const validar = async (e,) => { // función validar asincrónica
  e.preventDefault(); // evita refrescar
  const validar = [cedula, contrasena]; // inputs a validar
  let errores = ""; // almacena errores
  let cont = 0; // contador de control
  let cant = 0; // cantidad de errores
  validar.forEach(valor => { // recorre inputs
    if (valor.value.trim() === "") { // verifica vacío
      if (cont == 0) { // si es primer error
        cant++ // aumenta cantidad
        cont++; // marca encontrado
        errores += `${valor.classList[1]}`; // agrega nombre del campo
      }
      else { // si hay más de un error
        cant++ // aumenta cantidad
        errores += ` y ${valor.classList[1]}`; // concatena nombre del campo
      }
    }
  });
  if (!errores == "") { // si hay errores
    alertaWarning(`${errores} no puede${cant >= 2 ? "n" : ""} estar vacio${cant >= 2 ? "s" : ""} y solo puede${cant >= 2 ? "n" : ""} aceptar numeros.`) // alerta advertencia
    e.preventDefault; // evita enviar
    return; // sale
  }
  const valido = await esValido(e,cedula.value, contrasena.value); // llama función validar usuario
  if (valido)  // si es válido
  {
    await alertaOK("Inicio Sesión EXITOSO."); // alerta éxito
    formulario.action = `/src/html/menu.html#${cedula.value}`; // cambia acción del form
    formulario.submit(); // envía formulario
  }
};

const esValido = async (e,cedula, contrasena) => { // función valida credenciales
  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${cedula}`); // consulta api
    
    if (!response.ok) { // si la respuesta falla
      const mensaje = await response.text(); // obtiene mensaje
      throw new Error(mensaje); // lanza error
    }
    const data = await response.json(); // obtiene json
    
    if (cedula == data.cedula && contrasena == data.contrasena && data.activo == "1") { // si todo coincide
      return true; // válido
    }
    else if (cedula == data.cedula && data.activo == "1") { // si cedula coincide pero clave mal
      const mensaje = "Contraseña INCORRECTA."; // mensaje error
      throw new Error(mensaje); // lanza error
    }
    else if (cedula == data.cedula && !data.activo ||cedula == data.cedula && data.activo == "0") // si usuario no activo
    {
      const mensaje = "Usuario NO ACTIVADO"; // mensaje error
      throw new Error(mensaje); // lanza error
    }
  } catch (error) { // captura errores
    alertaError(error.message); // muestra alerta error
    e.preventDefault // evita enviar
    return false; // retorna falso
  }
}

const numeros = (event) => { // función para solo números
  if (!/^\d$/.test(event.key) && event.key !== "Backspace" && event.key !== "Tab") { // valida tecla
    event.preventDefault(); // evita ingreso
  }
};

formulario.addEventListener("submit", validar); // evento submit form
cedula.addEventListener("keydown", numeros); // evento solo números en cedula