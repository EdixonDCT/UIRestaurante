// Importa funciones de alertas personalizadas
import { alertaError, alertaOK, alertaPregunta } from "../alertas";
// Importa la función que carga la cabecera del usuario
import { cargarHeader } from "../header";

// Obtiene el hash de la URL (quita el símbolo #)
const hash = window.location.hash.slice(1);
// Separa el hash en partes (userId y mesaId)
const lista = hash.split("/");
// Primer valor del hash → id del usuario logueado
const idUser = lista[0];
// Segundo valor del hash → id de la mesa a editar
const idMesa = lista[1];

// Selecciona el formulario del DOM
const formulario = document.querySelector(".form")
// Selecciona el campo de número de mesa (readonly en edición)
const numeroMesa = document.querySelector(".numeroMesa");
// Selecciona el campo de capacidad de mesa
const capacidadMesa = document.querySelector(".capacidadMesa");

// Función que valida y envía los datos del formulario al backend
const validar = async (e) => {
    e.preventDefault(); // Evita envío automático del formulario

    // Se crea el objeto con los datos a actualizar (solo capacidad)
    const datos = {
        capacidad: capacidadMesa.value
    }

    try {
        // Hace petición PUT a la API para editar la mesa con idMesa
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${idMesa}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json" // Indica que el cuerpo es JSON
            },
            body: JSON.stringify(datos) // Convierte datos a JSON
        });

        // Obtiene el mensaje de la respuesta
        const mensaje = await response.text();

        // Si no fue exitosa, lanza un error
        if (!response.ok) {
            throw new Error(mensaje);
        }

        // Muestra alerta de éxito
        await alertaOK(mensaje);

        // Redirige de nuevo a la tabla de mesas del usuario
        formulario.action = `mesasTablas.html#${idUser}`
        formulario.submit();
    } catch (error) {
        // Muestra alerta de error si falla algo
        alertaError(error.message);
    }
}

// Función que obtiene la información de la mesa y la carga en el formulario
const infoMesa = async () => {
    // Configura el botón volver para regresar a la lista de mesas
    const botonVolver = document.getElementById("volver")
    botonVolver.action = `mesasTablas.html#${idUser}`;    

    try {
        // Hace petición GET para obtener la mesa
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${idMesa}`);
        const data = await response.json();

        // Carga los datos en los campos del formulario
        numeroMesa.value = data.numero;
        capacidadMesa.value = data.capacidad;
    } catch (error) {
        // Muestra error en consola si no pudo traer la mesa
        console.error("Error:", error);
    }
}

// Cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () =>
{
  // Carga la cabecera con la info del usuario
  cargarHeader(idUser);
  // Carga la información de la mesa en el formulario
  infoMesa();
});

// Asigna la función validar al evento submit del formulario
formulario.addEventListener("submit", validar);
