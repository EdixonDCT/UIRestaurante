// Importamos funciones de alertas personalizadas y la función para cargar el header
import { alertaError, alertaOK } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos la parte del hash de la URL, que probablemente identifica al usuario o sesión
const hash = window.location.hash.slice(1);

// Seleccionamos elementos del DOM: el formulario y el input del nombre del ingrediente
const formulario = document.querySelector(".form");
const nombreIngrediente = document.querySelector(".nombre");

// Función principal que valida y envía el formulario al API
const validar = async (e) => {
  e.preventDefault(); // Evita que el formulario se envíe de la manera tradicional

  // Creamos un objeto con los datos que se enviarán al backend
  const datos = {
    nombre: nombreIngrediente.value
  };

  try {
    // Hacemos un fetch al endpoint de ingredientes para crear uno nuevo
    const response = await fetch("http://localhost:8080/ApiRestaurente/api/ingredientes", {
      method: "POST", // Método POST para crear un nuevo recurso
      headers: {
        "Content-Type": "application/json" // Indicamos que enviamos JSON
      },
      body: JSON.stringify(datos) // Convertimos el objeto datos a JSON
    });

    // Leemos el mensaje que retorna el backend (puede ser éxito o error)
    const mensaje = await response.text();

    // Si la respuesta no es correcta, lanzamos un error con el mensaje
    if (!response.ok) {
      throw new Error(mensaje);
    }

    // Mostramos alerta de éxito
    await alertaOK(mensaje);

    // Cambiamos la acción del formulario para redirigir a la tabla de ingredientes
    formulario.action = `ingredientesTablas.html#${hash}`;

    // Enviamos el formulario (ahora con la nueva acción)
    formulario.submit();
  } catch (error) {
    // Si hubo error en la petición, mostramos alerta de error
    alertaError(error.message);
  }
};

// Asociamos la función validar al evento submit del formulario
formulario.addEventListener("submit", validar);

// Cuando el DOM esté cargado, hacemos ciertas inicializaciones
document.addEventListener("DOMContentLoaded", () => {
  cargarHeader(hash); // Cargamos el header, probablemente con info del usuario

  // Ajustamos el botón de "volver" para que regrese a la tabla de ingredientes
  const botonVolver = document.getElementById("volver");
  botonVolver.action = `ingredientesTablas.html#${hash}`;
});
