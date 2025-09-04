// Teclas espeiales
const teclasEspeciales = [ // Lista de teclas especiales que se permiten
  "Backspace", // Borrar
  "Tab", // Tabulación
  "Enter", // Enter
  "ArrowLeft", // Flecha izquierda
  "ArrowRight", // Flecha derecha
  "Delete", // Suprimir
  "Home", // Ir al inicio
  "End", // Ir al final
]; // Teclas especiales que se permiten

// Validación para los campos de texto con límite de caracteres
export const validarLimiteKey = (event, limite) => { // Función para validar longitud máxima
  const key = event.key; // Obtenemos la tecla presionada
  if (!teclasEspeciales.includes(key) && event.target.value.length >= limite) // Si no es tecla especial y ya superó el límite
    event.preventDefault(); // Evitamos la acción de la tecla si el campo supera el límite
};

// Validación para los campos de texto
export const validarTextoKey = (event) => { // Solo letras sin espacios
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/; // Expresión regular para letras y caracteres especiales
  if (!regex.test(key) && !teclasEspeciales.includes(key)) { // Si no es letra ni tecla especial
    event.preventDefault(); // Evitamos la acción de la tecla
  }
};

export const validarTextoEspacioKey = (event) => { // Letras y espacios
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Expresión regular que permite letras y espacios
  if (!regex.test(key) && !teclasEspeciales.includes(key)) { // Si no cumple con lo permitido
    event.preventDefault(); // Evitamos la acción de la tecla
  }
};

// Validación para los campos de número
export const validarNumeroKey = (event) => { // Solo números
  const key = event.key; // Obtenemos la tecla presionada
  const regex = /^[\d]*$/; // Expresión regular para números
  if (!regex.test(key) && !teclasEspeciales.includes(key)) // Si no es número ni tecla especial
    event.preventDefault(); // Evitamos la acción de la tecla
};

// Validación para la contraseña
export const validarContrasena = (campo) => { // Valida que cumpla requisitos
  let regexContra = /^(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/; // Expresión regular para validar la contraseña
  if (campo.parentElement.querySelector(".error")) { // Si ya tiene un error
    quitarError(campo.parentElement); // Lo quitamos
  }
  if (!regexContra.test(campo.value) && campo.value.trim() != "") { // Si la contraseña no cumple reglas
    let error = `${campo.name}: `; // Mensaje de error base
    let cont = 0; // Contador de errores
    if (!/[A-Z]/.test(campo.value)) error += "Una mayúscula"; cont++; // Falta mayúscula
    if (!/[a-z]/.test(campo.value)) cont > 0 ? (error += ",Una minúscula") : (error += "Una minúscula"); cont++; // Falta minúscula
    if (!/\d/.test(campo.value)) cont > 0 ? (error += ",Un número") : (error += "Un número"); cont++; // Falta número
    if (!/\W/.test(campo.value)) cont > 0 ? (error += ",Un carácter especial") : (error += "Un carácter especial"); cont++; // Falta símbolo
    if (campo.value.length < 8) cont > 0 ? (error += ",Al menos 8 caracteres") : (error += "Al menos 8 caracteres"); // Falta longitud
    error += "."; // Punto final
    agregarError(campo.parentElement, error); // Mostramos el error
    return false; // Contraseña inválida
  } else  // Si cumple, se valida
  return validarCampo(campo);
};

export const validarFecha = (campo) => { // Valida fechas
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); } // Quitamos error si existe
  const fechaSeleccionada = new Date(campo.value); // Fecha seleccionada
  const ahora = new Date(); // Fecha actual
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()); // Solo día actual
  if (fechaSeleccionada < hoy) { // Si es fecha pasada
    agregarError(campo.parentElement, "La fecha no puede ser hoy, ayer ni un día pasado"); 
    return false;
  }
  if (fechaSeleccionada.getTime() === hoy.getTime()) { // Si es hoy
    agregarError(campo.parentElement, "La fecha no puede ser hoy");
    return false;
  }
  validarCampo(campo); // Validamos campo si está correcto
  return true;
};

export const validarHora = (campo, campoFecha) => { // Valida hora
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  const fechaSeleccionada = new Date(campoFecha.value); // Fecha seleccionada
  const horaSeleccionada = campo.value; // Hora seleccionada
  const [hh, mm] = horaSeleccionada.split(":"); // Separa horas y minutos
  fechaSeleccionada.setHours(parseInt(hh), parseInt(mm), 0, 0); // Asigna hora a la fecha
  if (parseInt(hh) <= 8) { // Si es antes de 8 AM
    agregarError(campo.parentElement, "Si es mañana, debe ser después de las 8:00 a.m.");
    return false;
  }
  if (parseInt(hh) >= 22) { // Si es después de 10 PM
    agregarError(campo.parentElement, "Si es en la noche, debe ser antes de las 10:00 p.m");
    return false;
  }
  validarCampo(campo); // Validamos campo si es correcto
  return true;
};

// Validación para el correo electrónico
export const validarCorreo = (campo) => { 
  let regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i; // Expresión regular para correo
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  if (campo.value.trim() != "" && !regexCorreo.test(campo.value)) { // Si no cumple
    agregarError(campo.parentElement, "El correo electrónico no es válido.");
    return false;
  } else validarCampo(campo); // Si cumple, validamos
  return true;
};

export const validarCantidad = (campo, cantidad) => { // Valida mínimo de caracteres
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  if (campo.value.length < cantidad && campo.value.trim() != "") { // Si es menor a lo requerido
    agregarError(campo.parentElement, `${campo.name}: Al menos debe tener ${cantidad} caracteres.`);
    return false;
  }
  validarCampo(campo); // Validamos campo
  return true;
};

export const validarMayorEdad = (campo) => { // Valida mayoría de edad
  if (!validarCampo(campo)) return false;
  const fecha = new Date(campo.value);
  const hoy = new Date();
  const cumple18 = new Date(fecha.getFullYear() + 18, fecha.getMonth(), fecha.getDate()); // Fecha +18 años
  if (hoy >= cumple18) { return true; } // Si ya tiene 18
  else {
    agregarError(campo.parentElement, `${campo.name}: Debe ser mayor de edad.`);
    return false;
  }
};

export const validarContrasenaIgual = (campo, igual) => { // Valida confirmación de contraseña
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  if (campo.value !== igual.value && campo.value.trim() != "") { // Si no coinciden
    agregarError(campo.parentElement, `Contraseñas deben ser iguales.`);
    return false;
  }
  validarCampo(campo);
  return true;
};

export const validarImagen = (campo) => { // Valida carga de imagen
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  let foto = campo.files[0]; // Obtiene archivo
  if (!foto) { // Si no hay
    agregarError(campo.parentElement, `Imagen: Debe añadir una foto`);
    return false;
  }
  return true;
};

// Validación general de campos vacíos
export const validarCampo = (campo) => {
  if (campo.parentElement.querySelector(".error")) { quitarError(campo.parentElement); }
  if (
    ((campo.tagName == "INPUT" || campo.tagName == "TEXTAREA") && campo.value.trim() == "") || // Si input/textarea vacío
    (campo.tagName == "SELECT" && campo.selectedIndex == 0) // Si select sin opción
  ) {
    agregarError(campo.parentElement, `${campo.name}: no puede estar vacio.`);
    return false;
  }
  return true;
};

// --------------------------------------------------------
// Funciones para agregar y quitar errores
const agregarError = (campoPadre, mensaje) => { // Crea mensaje de error
  const campo = document.createElement("span");
  campo.classList.add("error");
  campo.textContent = mensaje;
  campoPadre.appendChild(campo);
};

export const quitarError = (campo) => { // Quita mensaje de error
  const hijo = campo.querySelector(".error");
  if (hijo) {
    campo.removeChild(hijo);
  }
};
