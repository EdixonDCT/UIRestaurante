// Importamos las funciones de alerta y la función para cargar el header
import { alertaError, alertaOK, alertaPregunta } from "../alertas.js";
import { cargarHeader } from "../header.js";

// Obtenemos el hash de la URL (generalmente es la cédula del trabajador)
const hash = window.location.hash.slice(1);

// Seleccionamos el formulario y el input de monto de apertura
const formulario = document.querySelector(".form");
const montoApertura = document.querySelector(".montoApertura");

// ======================================
// FUNCION PARA VALIDAR Y ENVIAR DATOS
// ======================================
const validar = async (e) => {
    e.preventDefault(); // Evitamos el envío normal del formulario

    // Creamos el objeto que se enviará al backend
    const datos = {
        montoApertura: montoApertura.value, // monto ingresado por el usuario
        cedulaTrabajador: hash               // cédula del trabajador (desde hash)
    };

    try {
        // Enviamos los datos al API para registrar la apertura de caja
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/caja", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text(); // obtenemos el mensaje del servidor

        // Si la respuesta no es OK, lanzamos un error
        if (!response.ok) throw new Error(mensaje);

        // Mostramos alerta de éxito
        await alertaOK(mensaje);

        // Redirigimos al listado de cajas con el hash en la URL
        formulario.action = `cajasTablas.html#${hash}`;
        formulario.submit();
    } catch (error) {
        // Mostramos alerta de error
        alertaError(error.message);
    }
};

// ======================================
// EVENTOS
// ======================================

// Al enviar el formulario, llamamos a la función validar
formulario.addEventListener("submit", validar);

// Cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    cargarHeader(hash); // Cargamos el header con los datos del usuario

    // Configuramos el botón "volver" para regresar al listado de cajas
    const botonVolver = document.getElementById("volver");
    botonVolver.action = `cajasTablas.html#${hash}`;
});
