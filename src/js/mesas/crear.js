// Importa las funciones de alertas personalizadas
import { alertaError, alertaOK, alertaPregunta } from "../alertas";
// Importa la función que carga la cabecera del perfil
import { cargarHeader } from "../header";

// Obtiene el hash de la URL (quita el símbolo #)
const hash = window.location.hash.slice(1);

// Selecciona el formulario del DOM
const formulario = document.querySelector(".form")
// Selecciona el campo de número de mesa
const numeroMesa = document.querySelector(".numeroMesa");
// Selecciona el campo de capacidad de mesa
const capacidadMesa = document.querySelector(".capacidadMesa");

// Función para validar y enviar los datos del formulario
const validar = async (e) => {
    e.preventDefault(); // Evita el envío automático del formulario

    // Se construye el objeto con los datos del formulario
    const datos = {
        numero: numeroMesa.value,
        capacidad: capacidadMesa.value
    }

    try {
        // Hace la petición POST a la API para registrar una nueva mesa
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/mesas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Especifica que el cuerpo es JSON
            },
            body: JSON.stringify(datos) // Convierte los datos en JSON
        });

        // Obtiene el mensaje de la respuesta
        const mensaje = await response.text();

        // Si la respuesta no es exitosa, lanza un error
        if (!response.ok) {
            throw new Error(mensaje);
        }

        // Muestra alerta de éxito
        await alertaOK(mensaje);

        // Redirige al usuario de nuevo a la tabla de mesas
        formulario.action = `mesasTablas.html#${hash}`
        formulario.submit();
    } catch (error) {
        // Muestra alerta de error si algo falla
        alertaError(error.message);
    }
}

// Asigna la función validar al evento submit del formulario
formulario.addEventListener("submit", validar);

// Cuando el documento está cargado
document.addEventListener("DOMContentLoaded", () => {
    // Carga la cabecera con los datos del trabajador logueado
    cargarHeader(hash)

    // Configura el botón de volver para regresar a la lista de mesas
    const botonVolver = document.getElementById("volver")
    botonVolver.action = `mesasTablas.html#${hash}`;    
})
