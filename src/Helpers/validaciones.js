// Teclas espeiales
const teclasEspeciales = [
  "Backspace",
  "Tab",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "Delete",
  "Home",
  "End",
]; // Teclas especiales que se permiten

// Validación para los campos de texto con límite de caracteres
export const validarLimiteKey = (event, limite) => {
  const key = event.key;
  if (!teclasEspeciales.includes(key) && event.target.value.length >= limite)
    event.preventDefault(); // Evitamos la acción de la tecla si el campo supera el límite
};

// Validación para los campos de texto
export const validarTextoKey = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/; // Expresión regular para letras y caracteres especiales

  // Validamos si la tecla no es una letra
  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
  }
};

export const validarTextoEspacioKey = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  // Expresión regular que permite letras (con tildes, ñ) y espacios
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; 

  // Validamos si la tecla no es válida
  if (!regex.test(key) && !teclasEspeciales.includes(key)) {
    event.preventDefault(); // Evitamos la acción de la tecla
  }
};

// Validación para los campos de número
export const validarNumeroKey = (event) => {
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\d]*$/; // Expresión regular para números

  // Validamos si la tecla no es un número
  if (!regex.test(key) && !teclasEspeciales.includes(key))
    event.preventDefault(); // Evitamos la acción de la tecla
};

// Validación para la contraseña
export const validarContrasena = (campo) => {
  let regexContra = /^(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/; // Expresión regular para validar la contraseña
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  if (!regexContra.test(campo.value) && campo.value.trim() != "") {
    let error = `${campo.name}: `;
    let cont = 0;
    if (!/[A-Z]/.test(campo.value))
      // Validamos si la contraseña contiene al menos una mayúscula
      error += "Una mayúscula";
    cont++;
    if (!/[a-z]/.test(campo.value))
      // Validamos si la contraseña contiene al menos una minúscula
      cont > 0 ? (error += ",Una minúscula") : (error += "Una minúscula");
    cont++;
    if (!/\d/.test(campo.value))
      // Validamos si la contraseña contiene al menos un número
      cont > 0 ? (error += ",Un número") : (error += "Un número");
    cont++;
    if (!/\W/.test(campo.value))
      // Validamos si la contraseña contiene al menos un carácter especial
      cont > 0
        ? (error += ",Un carácter especial")
        : (error += "Un carácter especial");
    cont++;
    if (campo.value.length < 8)
      // Validamos si la contraseña tiene al menos 8 caracteres
      cont > 0
        ? (error += ",Al menos 8 caracteres")
        : (error += "Al menos 8 caracteres");
    error += ".";
    agregarError(campo.parentElement, error); // Agregamos el error
    return false; // Si la contraseña es inválida, el formulario no es válido
  } else validarCampo(campo);
  return true;
};

export const validarFecha = (campo) => {
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  const fechaSeleccionada = new Date(campo.value);
  // Obtener fecha
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  // Validar que la fecha no sea pasada ni hoy
  if (fechaSeleccionada < hoy) {
    agregarError(
      campo.parentElement,
      "La fecha no puede ser hoy, ayer ni un día pasado"
    );
    return false;
  }
  if (fechaSeleccionada.getTime() === hoy.getTime()) {
    agregarError(campo.parentElement, "La fecha no puede ser hoy");
    return false;
  }
  validarCampo(campo);
  return true;
};

export const validarHora = (campo, campoFecha) => {
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  const fechaSeleccionada = new Date(campoFecha.value);
  const horaSeleccionada = campo.value;

  // Convertir fecha y hora seleccionada a Date completo
  const [hh, mm] = horaSeleccionada.split(":");
  fechaSeleccionada.setHours(parseInt(hh), parseInt(mm), 0, 0);

  // Validar que la fecha no sea pasada ni hoy
  if (parseInt(hh) <= 8) {
    agregarError(
      campo.parentElement,
      "Si es mañana, debe ser después de las 8:00 a.m."
    );
    return false;
  }
  if (parseInt(hh) >= 22) {
    agregarError(
      campo.parentElement,
      "Si es en la noche, debe ser antes de las 10:00 p.m"
    );
    return false;
  }
  validarCampo(campo);
  return true;
};

// Validación para el correo electrónico
export const validarCorreo = (campo) => {
  let regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  // Validamos si el correo es válido
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  if (campo.value.trim() != "" && !regexCorreo.test(campo.value)) {
    agregarError(campo.parentElement, "El correo electrónico no es válido."); // Agregamos el error
    return false; // Si el correo es inválido, el formulario no es válido
  } else validarCampo(campo);
  return true;
};
// Validación para el correo electrónico
export const validarCantidad = (campo, cantidad) => {
  // Validamos si la cantidad es la indicada
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  if (campo.value.length < cantidad && campo.value.trim() != "") {
    // Validamos si la contraseña tiene al menos 8 caracteres
    agregarError(
      campo.parentElement,
      `${campo.name}: Al menos debe tener ${cantidad} caracteres.`
    ); // Agregamos el error
    return false; // Si el correo es inválido, el formulario no es válido
  }
  validarCampo(campo); // Validamos el campo para agregar o quitar el error
  return true;
};
export const validarMayorEdad = (campo) => {
  if (!validarCampo(campo)) return false;
  const fecha = new Date(campo.value);
  const hoy = new Date();
  const cumple18 = new Date(
    fecha.getFullYear() + 18,
    fecha.getMonth(),
    fecha.getDate()
  );
  if (hoy >= cumple18) {
    return true;
  } else {
    agregarError(campo.parentElement, `${campo.name}: Debe ser mayor de edad.`); // Agregamos el error
    return false;
  }
};
export const validarContrasenaIgual = (campo, igual) => {
  // Validamos si la cantidad es la indicada
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  if (campo.value !== igual.value && campo.value.trim() != "") {
    // Validamos si la contraseña tiene al menos 8 caracteres
    agregarError(campo.parentElement, `Contraseñas deben ser iguales.`); // Agregamos el error
    return false; // Si el correo es inválido, el formulario no es válido
  }
  validarCampo(campo); // Validamos el campo para agregar o quitar el error
  return true;
};

export const validarImagen = (campo) => {
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  let foto = campo.files[0];
  if (!foto) {
    agregarError(campo.parentElement, `Imagen: Debe añadir una foto`);
    return false;
  }
  return true;
};
// --------------------------------------------------------

// Validación para los campos de texto y las listas desplegables
// Retorna true o false dependiendo de si el campo es válido o no
export const validarCampo = (campo) => {
  // Quitamos el error
  if (campo.parentElement.querySelector(".error")) {
    quitarError(campo.parentElement);
  }
  if (
    ((campo.tagName == "INPUT" || campo.tagName == "TEXTAREA") &&
      campo.value.trim() == "") || // Validamos si el campo es un input o un textarea y está vacío
    (campo.tagName == "SELECT" && campo.selectedIndex == 0) // Validamos si el campo es un select y no se ha seleccionado una opción
  ) {
    agregarError(campo.parentElement, `${campo.name}: no puede estar vacio.`); // Agregamos el error
    return false;
  }
  return true;
};

// --------------------------------------------------------
// Funciones para agregar y quitar errores

// Agrega un borde rojo y un mensaje de advertencia al campo
const agregarError = (campoPadre, mensaje) => {
  const campo = document.createElement("span");
  campo.classList.add("error");
  campo.textContent = mensaje;
  campoPadre.appendChild(campo);
};

// Quita el borde rojo y el mensaje de advertencia del campo
export const quitarError = (campo) => {
  const hijo = campo.querySelector(".error");
  if (hijo) {
    campo.removeChild(hijo);
  }
};
